import ExcelJS from 'exceljs';
import { parse } from 'csv-parse/sync';
import Product from '../../models/product/product.model';
import Category from '../../models/category/category.model';
import Brand from '../../models/brand/brand.model';
import { ImportResult, ProductImportRow } from './types';

export const processProductImport = async (fileBuffer: Buffer, fileType: string): Promise<ImportResult> => {
  let rows: ProductImportRow[] = [];

  // 1. EXTRAER DATOS (EXCEL O CSV)
  if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel') {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) throw new Error('No se encontró la hoja de cálculo');

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      const getValue = (cell: ExcelJS.CellValue | undefined): string => cell ? cell.toString() : '';

      rows.push({
        sku: getValue(row.getCell(1).value),
        name: getValue(row.getCell(2).value),
        slug: getValue(row.getCell(3).value) || getValue(row.getCell(2).value).toLowerCase().replace(/ /g, '-'),
        categoryName: getValue(row.getCell(4).value),
        brandName: getValue(row.getCell(5).value),
        costPrice: Number(row.getCell(6).value || 0),
        price: Number(row.getCell(7).value || 0),
        stock: Number(row.getCell(8).value || 0),
        minStock: Number(row.getCell(9).value || 5),
        shortDescription: getValue(row.getCell(10).value),
        status: (row.getCell(11).value as ProductImportRow['status']) || 'draft'
      });
    });
  } else {
    const content = fileBuffer.toString();
    const records = parse(content, { columns: true, skip_empty_lines: true });
    rows = records.map((r: Record<string, string>) => ({
      sku: r.sku,
      name: r.name,
      slug: r.slug || r.name.toLowerCase().replace(/ /g, '-'),
      categoryName: r.categoryName,
      brandName: r.brandName,
      costPrice: Number(r.costPrice),
      price: Number(r.price),
      stock: Number(r.stock || 0),
      minStock: Number(r.minStock || 5),
      shortDescription: r.shortDescription || '',
      status: (r.status as ProductImportRow['status']) || 'draft'
    }));
  }

  const result: ImportResult = { successCount: 0, errorCount: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      if (!row.sku || !row.name || !row.categoryName || !row.brandName) {
        throw new Error('Faltan campos obligatorios: SKU, Nombre, Categoría o Marca');
      }

      // 2. AUTO-CREAR CATEGORÍA SI NO EXISTE
      let category = await Category.findOne({ name: { $regex: new RegExp(`^${row.categoryName}$`, 'i') } });
      if (!category) {
        category = await Category.create({
          name: row.categoryName,
          slug: row.categoryName.toLowerCase().replace(/ /g, '-'),
          isActive: true
        });
      }

      // 3. AUTO-CREAR MARCA SI NO EXISTE
      let brand = await Brand.findOne({ name: { $regex: new RegExp(`^${row.brandName}$`, 'i') } });
      if (!brand) {
        brand = await Brand.create({
          name: row.brandName,
          description: `Marca creada automáticamente por importación`,
          isActive: true
        });
      }

      // 4. PREPARAR DATOS DEL PRODUCTO 
      const existingProduct = await Product.findOne({ sku: row.sku });
      const productData = {
        name: row.name,
        slug: row.slug,
        category: {
          _id: category._id,
          uuid: category.uuid,
          name: category.name,
          slug: category.slug
        },
        brand: {
          _id: brand._id,
          name: brand.name
        },
        costPrice: row.costPrice,
        price: row.price,
        stock: row.stock,
        minStock: row.minStock,
        shortDescription: row.shortDescription,
        status: row.status,
        images: existingProduct ? existingProduct.images : []
      };

      await Product.updateOne(
        { sku: row.sku },
        { $set: productData, $setOnInsert: { sku: row.sku } },
        { upsert: true, runValidators: true }
      );

      result.successCount++;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      result.errorCount++;
      result.errors.push({ row: i + 2, error: message });
    }
  }

  return result;
};

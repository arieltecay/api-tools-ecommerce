import ExcelJS from 'exceljs';
import { parse } from 'csv-parse/sync';
import Product from '../models/product.model';
import Category from '../models/category.model';
import Brand from '../models/brand.model';
import { IProduct, ICategory, IBrand } from '../models/types';

export interface ImportResult {
  successCount: number;
  errorCount: number;
  errors: { row: number; error: string }[];
}

interface ProductImportRow {
  sku: string;
  name: string;
  slug: string;
  categoryName: string;
  brandName: string;
  costPrice: number;
  price: number;
  stock: number;
  minStock: number;
  shortDescription: string;
  status: 'active' | 'paused' | 'draft' | 'out_of_stock';
}

export const processProductImport = async (fileBuffer: Buffer, fileType: string): Promise<ImportResult> => {
  let rows: ProductImportRow[] = [];

  if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const workbook = new ExcelJS.Workbook();
    // Use Buffer.from to ensure compatibility with ExcelJS load method
    const buffer = Buffer.from(fileBuffer);
    await workbook.xlsx.load(buffer as any); // exceljs types can be tricky with Node versions
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) throw new Error('No worksheet found');

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      const values = row.values as ExcelJS.CellValue[];
      rows.push({
        sku: String(values[1] || ''),
        name: String(values[2] || ''),
        slug: String(values[3] || values[2]?.toString().toLowerCase().replace(/ /g, '-') || ''),
        categoryName: String(values[4] || ''),
        brandName: String(values[5] || ''),
        costPrice: Number(values[6] || 0),
        price: Number(values[7] || 0),
        stock: Number(values[8] || 0),
        minStock: Number(values[9] || 5),
        shortDescription: String(values[10] || ''),
        status: (values[11] as ProductImportRow['status']) || 'draft'
      });
    });
  } else {
    const content = fileBuffer.toString();
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });
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

  const allCategories: ICategory[] = await Category.find({ isActive: true });
  const allBrands: IBrand[] = await Brand.find({ isActive: true });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      if (!row.sku || !row.name || !row.categoryName || !row.brandName) {
        throw new Error('Campos obligatorios faltantes (SKU, Nombre, Categoría o Marca)');
      }

      const category = allCategories.find(c => c.name.toLowerCase() === row.categoryName.toLowerCase());
      if (!category) throw new Error(`Categoría "${row.categoryName}" no encontrada`);

      const brand = allBrands.find(b => b.name.toLowerCase() === row.brandName.toLowerCase());
      if (!brand) throw new Error(`Marca "${row.brandName}" no encontrada`);

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
        status: row.status
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

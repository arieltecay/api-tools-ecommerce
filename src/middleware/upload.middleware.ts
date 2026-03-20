import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
  },
});

export const uploadExcel = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit para excels grandes
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /xlsx|csv|xls|vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
    const isExcel = filetypes.test(file.mimetype) || filetypes.test(path.extname(file.originalname).toLowerCase());

    if (isExcel) {
      return cb(null, true);
    }
    cb(new Error('Formato de archivo no válido. Solo se permiten .xlsx o .csv'));
  },
});

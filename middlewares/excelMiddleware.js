import multer from 'multer';
import crypto from 'crypto';

const mimeExtensionMap = {
  'text/csv': '.csv',
  'application/vnd.ms-excel': '.csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = mimeExtensionMap[file.mimetype] || '';
    const uniqueName = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (mimeExtensionMap[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé (csv, xlsx uniquement)'));
  }
};

const uploadExcel = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

export default uploadExcel;

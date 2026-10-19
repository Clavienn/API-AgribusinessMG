import multer from 'multer';
import crypto from 'crypto';


const mimeExtensionMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/jpg': '.jpg',
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
    cb(new Error('Type de fichier non autorisé (jpg, jpeg, png, webp uniquement)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;

// Third party imports
import multer from "multer";

// User imports
import { createBadRequestError } from "./AppError.js";

const diskStorage = multer.diskStorage({
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${Math.floor(Math.random() * 1000000)}-${file.originalname}`);
  },
  destination(req, file, callback) {
    callback(null, `./uploads`);
  },
});

const acceptedFileTypes: string[] = ["image/jpeg", "image/jpg", "image/png"];

const upload = multer({
  storage: diskStorage,
  fileFilter(req, file, callback) {
    if (!acceptedFileTypes.includes(file.mimetype)) {
      callback(createBadRequestError("Accepted types are : jpeg, jpg or png"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 3_145_728, // 3MB
  },
});

export default upload;

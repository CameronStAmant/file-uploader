import multer from "multer";
import mime from "mime-types";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = mime.extension(file.mimetype);
    cb(null, file.originalname + `.${extension}`);
  },
});
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const acceptedFileTypes = ["image/png", "image/jpeg"];
    if (!acceptedFileTypes.includes(file.mimetype)) {
      return cb(new Error("Wrong file type"));
    }
    cb(null, true);
  },
});

export default upload;

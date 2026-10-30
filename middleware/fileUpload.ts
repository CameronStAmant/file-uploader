import multer from "multer";
import "dotenv/config";

const storage = multer.memoryStorage();
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

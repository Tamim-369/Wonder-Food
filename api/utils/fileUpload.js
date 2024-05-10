// uploadFile.js
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "api/uploads/");
  // },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extname);
  },
});

const upload = multer({ storage: storage });
export default upload;

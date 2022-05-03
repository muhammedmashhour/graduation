const multer = require("multer");

module.exports = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `media/files/${folderName}`)
    },
    filename: function (req, file, cb) {
      cb(null, `f_${Math.random()}_${Date.now()}_${file.originalname}`)
    }
  });

  return multer({ storage: storage })
}
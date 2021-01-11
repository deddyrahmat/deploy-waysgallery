const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("./cloudinary");

exports.uploadFile = ([image]) => {

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'waysgallery',
        format: "jpeg"
      };
    },
  });

  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads")
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, Date.now() + "-" + file.originalname);
  //   },
  // });

  const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!"
        }
        return cb(new Error("Only image files are allowed!"), false)
    }
    cb(null, true)
  }

  const maxSize = 1 * 1000 * 1000; //Maximum file size 1 MB

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  })
  // .fields([
  //   {
  //     name: image,
  //     maxCount: 1,
  //   }
  // ])
  .array('image',10)
  //fields digunakan karena file yang diupload lebih dari 1 fields
  // maksimal 10 image yang di upload

  //middleware handler
  return (req, res, next) => {
    upload(req, res, function (err) {
      //munculkan error jika validasi gagal
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError)

      //munculkan error jika file tidak disediakan
      if (!req.files && !err)
        return res.status(400).send({
          message: "Please select images to upload",
        })

      //munculkan error jika melebihi max size
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 1 MB",
          })
        }
        return res.status(400).send(err)
      }
      //jika oke dan aman lanjut ke controller
      //akses nnti pake req.files
      return next();
    })
  }
}
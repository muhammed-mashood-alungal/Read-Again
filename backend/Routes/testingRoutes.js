const express = require('express')
const router = express.Router()
const multer = require('multer');
const { handleUpload } = require('../utils/cloudinary');

const storage = new multer.memoryStorage()

const upload = multer({
    storage,
  });


router.post("/upload", upload.single("my_file"), async (req, res) => {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      console.log(cldRes)
      res.json(cldRes);
    } catch (error) {
      console.log(error);
      res.send({
        message: error.message,
      });
    }
  });

  module.exports= router 
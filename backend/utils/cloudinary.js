const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  })
  return res;
}

function deleteImage(publicId) {
  cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      return;
    }
  })

}

module.exports = { handleUpload, deleteImage }
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dd5gdnntv",
    api_key:'819899399545136',
    api_secret: 'iLZyZuGtDKEIqWvnmMaPwYnNzkg',
  });

async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
}

function deleteImage(publicId) {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return;
      }
    });
  }
  
  module.exports ={handleUpload , deleteImage}
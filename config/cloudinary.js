const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "daozw5gbd",
  api_key: "353899861967679",
  api_secret: "m4Pk6seAO_G50olOMRqAy25nVsk"
});

module.exports = cloudinary;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dhvfmcpzw",
    api_key: "442785371636853",
    api_secret: "4WMBAqQwAFvUgvMNZtyjZxZ3y_w"
});

module.exports = cloudinary;
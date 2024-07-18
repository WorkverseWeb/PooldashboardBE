const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageData: { type: String },
  contentType: { type: String }, // Content type of the image
  email: { type: String, required: true, unique: true },
});

const ProfileImage = mongoose.model("ProfileImage", imageSchema);

module.exports = ProfileImage;

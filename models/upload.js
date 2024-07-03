const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileImage:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         imageUrl:
 *           type: string
 *           description: URL of the profile image stored in AWS S3.
 *           example: https://your-bucket-name.s3.amazonaws.com/profileImages/1627888289147-image.png
 *         email:
 *           type: string
 *           description: Email associated with the profile image.
 *           example: user@example.com
 */

const imageSchema = new mongoose.Schema({
  imageData: { type: String },
  contentType: { type: String }, // Content type of the image
  email: { type: String, required: true, unique: true },
});

const ProfileImage = mongoose.model("ProfileImage", imageSchema);

module.exports = ProfileImage;

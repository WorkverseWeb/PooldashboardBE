const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  handleGetAllImages,
  handlePostAllImages,
} = require("../controllers/upload");

// Multer setup
const storageImg = multer.memoryStorage();
const uploadImage = multer({ storage: storageImg });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a profile image
 *     description: Upload a profile image to S3 and save the image URL to the database.
 *     tags:
 *       - Profile Image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The image file to upload.
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         description: The email associated with the profile image.
 *         required: true
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               description: URL of the uploaded image
 *               example: https://your-bucket-name.s3.amazonaws.com/profileImages/1627888289147-image.png
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileImage'
 *       400:
 *         description: Missing email or file
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Missing email or file
 *       500:
 *         description: Failed to upload image
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Failed to upload image
 * /upload/{email}:
 *   get:
 *     summary: Get profile image by email
 *     description: Fetch the profile image URL by email.
 *     tags:
 *       - Profile Image
 *     parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         required: true
 *         description: The email associated with the profile image.
 *     responses:
 *       200:
 *         description: Image fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 60d21b4967d0d8992e610c85
 *             imageUrl:
 *               type: string
 *               example: https://your-bucket-name.s3.amazonaws.com/profileImages/1627888289147-image.png
 *             email:
 *               type: string
 *               example: user@example.com
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileImage'
 *       404:
 *         description: Image not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Image not found
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Internal server error
 */
router.get("/:email", handleGetAllImages);

router.post("/", uploadImage.single("image"), handlePostAllImages);

module.exports = router;

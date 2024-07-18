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

router.get("/:email", handleGetAllImages);

router.post("/", uploadImage.single("image"), handlePostAllImages);

module.exports = router;

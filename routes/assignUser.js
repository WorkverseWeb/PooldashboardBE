const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  handleGetAllAssignUser,
  handlePostAllAssignUser,
} = require("../controllers/assignUser");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", handleGetAllAssignUser);

router.post("/", upload.single("file"), handlePostAllAssignUser);

module.exports = router;

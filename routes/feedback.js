const express = require("express");
const router = express.Router();
const { handlePostAllFeedback } = require("../controllers/feedback");

router.post("/", handlePostAllFeedback);

module.exports = router;

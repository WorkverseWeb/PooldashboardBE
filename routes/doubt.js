const express = require("express");
const router = express.Router();
const { handlePostAllDoubt } = require("../controllers/doubt");

router.post("/:email", handlePostAllDoubt);

module.exports = router;

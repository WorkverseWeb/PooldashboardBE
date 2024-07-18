const express = require("express");
const router = express.Router();
const {
  handleGetAllSlot,
  handlePostAllSlot,
  handlePatchAllSlot,
} = require("../controllers/slot");

router.get("/:email", handleGetAllSlot);

router.post("/", handlePostAllSlot);

router.patch("/:email", handlePatchAllSlot);

module.exports = router;

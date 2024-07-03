const express = require("express");
const router = express.Router();
const {
  handleGetAllInitialSlot,
  handlePostAllInitialSlot,
  handlePatchAllInitialSlot,
} = require("../controllers/initialSlot");

router.get("/:email", handleGetAllInitialSlot);

router.post("/", handlePostAllInitialSlot);

router.patch("/:email", handlePatchAllInitialSlot);

module.exports = router;

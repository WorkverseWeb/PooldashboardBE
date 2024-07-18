const express = require("express");
const router = express.Router();
const {
  handleGetAllPreferences,
  handlePatchAllPreferences,
} = require("../controllers/preferences");

router.get("/:email", handleGetAllPreferences);

router.patch("/:email", handlePatchAllPreferences);

module.exports = router;

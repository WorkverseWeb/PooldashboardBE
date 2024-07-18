const express = require("express");
const router = express.Router();
const {
  handleGetAllGroup,
  handlePostAllGroup,
  handlePatchAllGroup,
} = require("../controllers/group");


router.get("/:email", handleGetAllGroup);

router.post("/", handlePostAllGroup);

router.patch("/:email", handlePatchAllGroup);

module.exports = router;

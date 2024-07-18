const express = require("express");
const router = express.Router();
const {
  handleGetAllUser,
  handlePostAllUser,
  handlePatchAllUser,
} = require("../controllers/user");


router.get("/", handleGetAllUser);

router.post("/", handlePostAllUser);

router.patch("/:email", handlePatchAllUser);

module.exports = router;

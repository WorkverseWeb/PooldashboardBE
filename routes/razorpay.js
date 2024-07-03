const express = require("express");
const router = express.Router();
const {
  handlePostAllRazorpay,
  handlePatchAllRazorpay,
} = require("../controllers/razorpay");

// razor pay
router.post("/", handlePostAllRazorpay);

router.patch("/:orderId", handlePatchAllRazorpay);

module.exports = router;

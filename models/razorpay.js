const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

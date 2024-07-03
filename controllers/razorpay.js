const Order = require("../models/razorpay");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function handlePostAllRazorpay(req, res) {
  const { amount, currency } = req.body;
  const options = {
    amount: amount,
    currency: currency,
    receipt: `order_${Math.floor(Math.random() * 1000000)}`,
    payment_capture: 1,
  };
  try {
    const response = await razorpay.orders.create(options);

    const order = new Order({
      order_id: response.id,
      currency: response.currency,
      amount: amount / 100,
    });
    await order.save();

    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: amount / 100,
    });
  } catch (err) {
    res.status(400).send("Not able to create order. Please try again!");
  }
}

async function handlePatchAllRazorpay(req, res) {
  const { paymentStatus } = req.body;
  const orderId = req.params.orderId;

  try {
    const order = await Order.findOneAndUpdate(
      { order_id: orderId },
      { $set: { paymentStatus: paymentStatus } },
      { new: true }
    );

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order payment status:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  handlePostAllRazorpay,
  handlePatchAllRazorpay,
};

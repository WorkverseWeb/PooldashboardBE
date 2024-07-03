const Slot = require("../models/slot");

async function handleGetAllSlot(req, res) {
  try {
    const { email } = req.params;
    const slot = await Slot.findOne({ email });
    if (!slot) {
      return res
        .status(404)
        .json({ error: "Slot not found for the specified user" });
    }
    res.status(200).json(slot);
  } catch (error) {
    console.error("Error retrieving slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handlePostAllSlot(req, res) {
  const { email, AllProducts, TotalAmount } = req.body;

  try {
    const newSlot = new Slot({ email, AllProducts, TotalAmount });
    await newSlot.save();
    res.status(200).send("Slot created successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

async function handlePatchAllSlot(req, res) {
  const { email } = req.params;
  const { AllProducts, paymentStatus, TotalAmount } = req.body;

  try {
    const slot = await Slot.findOne({ email });
    if (!slot) {
      return res.status(404).send("Slot not found");
    }

    Object.keys(AllProducts).forEach((key) => {
      if (AllProducts[key] !== undefined) {
        slot.AllProducts[key] = AllProducts[key];
      }
    });

    const validStatuses = ["Success", "Failed", "Pending", "Reset"];
    if (paymentStatus && validStatuses.includes(paymentStatus)) {
      slot.AllProducts.paymentStatus = paymentStatus;
    }

    if (TotalAmount !== undefined) {
      slot.TotalAmount = TotalAmount;
    }

    await slot.save();
    res.status(200).send("slot updated successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  handleGetAllSlot,
  handlePostAllSlot,
  handlePatchAllSlot,
};

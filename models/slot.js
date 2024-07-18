const mongoose = require("mongoose");


const validStatuses = ["Success", "Failed", "Pending", "Reset"];

const slotSchema = new mongoose.Schema({
  email: { type: String, required: true },
  AllProducts: {
    level1: { type: Number, default: 0 },
    level2: { type: Number, default: 0 },
    level3: { type: Number, default: 0 },
    level4: { type: Number, default: 0 },
    level5: { type: Number, default: 0 },
    level6: { type: Number, default: 0 },
    level7: { type: Number, default: 0 },
    level8: { type: Number, default: 0 },
    level9: { type: Number, default: 0 },
    allLevels: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: validStatuses, default: "Pending" },
  },
  TotalAmount: { type: Number, default: 0 },
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;

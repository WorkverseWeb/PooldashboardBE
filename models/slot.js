const mongoose = require("mongoose");

/**
 * @swagger
 * tags:
 *   name: Slot
 *   description: Operations related to user slots
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Slot:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email address of the user
 *         AllProducts:
 *           type: object
 *           properties:
 *             level1:
 *               type: number
 *               default: 0
 *             level2:
 *               type: number
 *               default: 0
 *             level3:
 *               type: number
 *               default: 0
 *             level4:
 *               type: number
 *               default: 0
 *             level5:
 *               type: number
 *               default: 0
 *             level6:
 *               type: number
 *               default: 0
 *             level7:
 *               type: number
 *               default: 0
 *             level8:
 *               type: number
 *               default: 0
 *             level9:
 *               type: number
 *               default: 0
 *             allLevels:
 *               type: number
 *               default: 0
 *             paymentStatus:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [Success, Failed, Pending, Reset]
 *                 default: Pending
 *         TotalAmount:
 *           type: number
 *           description: Total amount of the slot
 */

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

const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         number:
 *           type: number
 *         poolForCreator:
 *           type: string
 *         organization:
 *           type: string
 *         designation:
 *           type: string
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         linkdeInURL:
 *           type: string
 *         status:
 *           type: array
 *           items:
 *             type: string
 *         totalPurchasedUsers:
 *           type: number
 *         slotsAvailable:
 *           type: number
 *         totalAssignedPlayers:
 *           type: number
 *         group:
 *           type: array
 *           items:
 *             type: string
 *         totalAmountPaid:
 *           type: number
 *         totalWIP:
 *           type: number
 *         invoices:
 *           type: array
 *           items:
 *             type: string
 *         cartAddedProducts:
 *           type: object
 *           properties:
 *             cartTotalAmount:
 *               type: number
 *         totalInactive:
 *           type: boolean
 *           default: false
 *         totalChatting:
 *           type: boolean
 *           default: false
 *         totalFinishedGame:
 *           type: boolean
 *           default: false
 *         yesToLevelNotification:
 *           type: boolean
 *           default: true
 *         yesToProductUpdate:
 *           type: boolean
 *           default: true
 *         yesToSubscribeNewsletter:
 *           type: boolean
 *           default: true
 *   responses:
 *     200:
 *       description: Success
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
 */
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: Number, required: true },
  poolForCreator: { type: String, required: true },
  organization: { type: String, required: true },
  designation: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  linkdeInURL: String,
  status: { type: [String] },
  totalPurchasedUsers: Number,
  slotsAvailable: Number,
  totalAssignedPlayers: Number,
  group: { type: [String] },
  totalAmountPaid: Number,
  totalWIP: Number,
  invoices: { type: [String] },
  cartAddedProducts: {
    level1: Number,
    level2: Number,
    level3: Number,
    level4: Number,
    level5: Number,
    level6: Number,
    level7: Number,
    level8: Number,
    level9: Number,
    allLevels: Number,
    paymentStatus: { type: [String] },
  },
  cartTotalAmount: Number,
  totalInactive: Boolean,
  totalChatting: Boolean,
  totalFinishedGame: Boolean,
  yesToLevelNotification: Boolean,
  yesToProductUpdate: Boolean,
  yesToSubscribeNewsletter: Boolean,
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;

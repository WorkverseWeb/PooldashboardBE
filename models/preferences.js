const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  totalInactive: { type: Boolean, default: true },
  totalChatting: { type: Boolean, default: true },
  totalFinishedGame: { type: Boolean, default: true },
  yesToLevelNotification: { type: Boolean, default: false },
  yesToProductUpdate: { type: Boolean, default: false },
  yesToSubscribeNewsletter: { type: Boolean, default: false },
});
// just for test
const UserPreferences = mongoose.model(
  "UserPreferences",
  userPreferencesSchema
);

module.exports = UserPreferences;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreferences:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         totalInactive:
 *           type: boolean
 *           description: Email when someone is inactive
 *         totalChatting:
 *           type: boolean
 *           description: Email when someone is not interacting with Neuroda
 *         totalFinishedGame:
 *           type: boolean
 *           description: Email when someone finishes the game
 *         yesToLevelNotification:
 *           type: boolean
 *           description: Notify when a new level is added
 *         yesToProductUpdate:
 *           type: boolean
 *           description: Monthly product updates
 *         yesToSubscribeNewsletter:
 *           type: boolean
 *           description: Subscribe to newsletter
 */

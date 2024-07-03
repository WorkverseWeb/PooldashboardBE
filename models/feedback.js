const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *         - userEmail
 *         - selectedEmoji
 *       properties:
 *         userEmail:
 *           type: string
 *           description: The user's email
 *         selectedEmoji:
 *           type: integer
 *           description: The index of the selected emoji
 *       example:
 *         userEmail: user@example.com
 *         selectedEmoji: 2
 */

const feedbackSchema = new mongoose.Schema({
  userEmail: String,
  selectedEmoji: Number,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;

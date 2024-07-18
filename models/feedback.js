const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userEmail: String,
  selectedEmoji: Number,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;

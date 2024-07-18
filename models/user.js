const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  number: { type: Number, required: true },
  poolForCreator: { type: String, required: true },
  organization: { type: String, required: true },
  designation: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  linkdeInURL: String,
  status: { type: [String] },
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;

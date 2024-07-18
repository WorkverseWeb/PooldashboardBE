const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  groupname: { type: [String], required: true },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;

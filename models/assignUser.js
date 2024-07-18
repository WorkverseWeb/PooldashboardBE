const mongoose = require("mongoose");

const assignUserSchema = new mongoose.Schema(
  {
    auName: { type: String, required: true },
    auEmail: { type: String, required: true, unique: true },
    auGroup: { type: String, required: true },
    auSkills: { type: [String], required: true },
    auPlaying: { type: Boolean, default: false },
    auChatting: { type: Boolean, default: false },
    auFinishedGame: { type: Boolean, default: false },
    auActiveUser: { type: Boolean, default: true },
    auWIP: { type: [String] },
    addedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AssignUser = mongoose.model("AssignUser", assignUserSchema);

module.exports = AssignUser;

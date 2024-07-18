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

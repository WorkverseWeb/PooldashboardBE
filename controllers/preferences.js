const UserPreferences = require("../models/preferences");

async function handleGetAllPreferences(req, res) {
  try {
    const defaultPreferences = {
      totalInactive: true,
      totalChatting: true,
      totalFinishedGame: true,
      yesToLevelNotification: false,
      yesToProductUpdate: false,
      yesToSubscribeNewsletter: false,
    };

    const preferences = await UserPreferences.findOne({
      email: req.params.email,
    });
    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }

    // Override default preferences with user's preferences
    const mergedPreferences = {
      ...defaultPreferences,
      ...preferences.toObject(),
    };
    res.json(mergedPreferences);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function handlePatchAllPreferences(req, res) {
  try {
    const preferences = await UserPreferences.findOneAndUpdate(
      { email: req.params.email },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ message: "Preferences updated successfully", preferences });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  handleGetAllPreferences,
  handlePatchAllPreferences,
};

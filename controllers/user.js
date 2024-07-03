const User = require("../models/user");

async function handleGetAllUser(req, res) {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email and status is required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handlePostAllUser(req, res) {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function handlePatchAllUser(req, res) {
  const { email } = req.params;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's information with data from the form
    user = await User.findOneAndUpdate({ email }, req.body, { new: true });

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGetAllUser,
  handlePostAllUser,
  handlePatchAllUser,
};

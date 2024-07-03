const Group = require("../models/group");

async function handleGetAllGroup(req, res) {
  try {
    const { email } = req.params;

    const group = await Group.findOne({ email });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handlePostAllGroup(req, res) {
  try {
    const { email, groupname } = req.body;

    const existingGroup = await Group.findOne({ email, groupname });

    if (existingGroup) {
      res.status(200).json({ message: "Group already exists." });
    } else {
      const newGroup = await Group.create({ email, groupname });

      res.status(201).json(newGroup);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handlePatchAllGroup(req, res) {
  try {
    const { email } = req.params;
    const { groupname } = req.body;

    let updatedGroup;

    if (groupname.length === 0) {
      updatedGroup = await Group.findOneAndUpdate(
        { email },
        { $unset: { groupname: "" } },
        { new: true }
      );
    } else {
      updatedGroup = await Group.findOneAndUpdate(
        { email },
        { groupname },
        { new: true }
      );
    }

    if (!updatedGroup) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  handleGetAllGroup,
  handlePostAllGroup,
  handlePatchAllGroup,
};

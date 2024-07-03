const InitialSlot = require("../models/initialSlot");

async function handleGetAllInitialSlot(req, res) {
  try {
    const { email } = req.params;
    const initslot = await InitialSlot.findOne({ email });
    if (!initslot) {
      return res
        .status(404)
        .json({ error: "Slot not found for the specified user" });
    }
    res.status(200).json(initslot);
  } catch (error) {
    console.error("Error retrieving slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handlePostAllInitialSlot(req, res) {
  const { email, AllProducts } = req.body;

  try {
    const newInitSlot = new InitialSlot({ email, AllProducts });
    await newInitSlot.save();
    res.status(200).send("Slot created successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

async function handlePatchAllInitialSlot(req, res) {
  const { email } = req.params;
  const { AllProducts } = req.body;

  try {
    const initslot = await InitialSlot.findOne({ email });
    if (!initslot) {
      return res.status(404).send("Slot not found");
    }

    Object.keys(AllProducts).forEach((key) => {
      if (AllProducts[key] !== undefined) {
        initslot.AllProducts[key] = AllProducts[key];
      }
    });

    await initslot.save();
    res.status(200).send("slot updated successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  handleGetAllInitialSlot,
  handlePostAllInitialSlot,
  handlePatchAllInitialSlot,
};

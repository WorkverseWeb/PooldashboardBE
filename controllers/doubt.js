const Issue = require("../models/doubt");

async function handlePostAllDoubt(req, res) {
  const { email } = req.params;
  const { issue, doubt } = req.body;

  try {
    // Create a new issue entry
    const newIssue = new Issue({
      email,
      issue,
      doubt,
    });

    const savedIssue = await newIssue.save();

    res.status(200).json({
      message: "Issue submitted successfully",
      data: savedIssue,
    });
  } catch (error) {
    console.error("Error submitting the issue:", error);
    res.status(500).json({ error: "Error submitting the issue" });
  }
}

module.exports = {
  handlePostAllDoubt,
};

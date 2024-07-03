const Feedback = require("../models/feedback");

async function handlePostAllFeedback(req, res) {
  const {
    userEmail,
    selectedEmoji,
    formType,
    selectedEmojiFeedback2,
    selectedEmojiFeedback3,
  } = req.body;

  if (!userEmail) {
    return res.status(400).send("userEmail is required");
  }

  if (
    (formType === undefined || formType === "form1") &&
    selectedEmoji === undefined
  ) {
    return res.status(400).send("selectedEmoji is required for form1");
  }

  if (formType === "form2" && selectedEmojiFeedback2 === undefined) {
    return res.status(400).send("selectedEmojiFeedback2 is required for form2");
  }

  if (formType === "form3" && selectedEmojiFeedback3 === undefined) {
    return res.status(400).send("selectedEmojiFeedback3 is required for form3");
  }

  try {
    if (formType === "form1" || formType === undefined) {
      const feedback = new Feedback({ userEmail, selectedEmoji });
      await feedback.save();
    } else if (formType === "form2") {
      const feedback2 = new Feedback({
        userEmail,
        selectedEmoji: selectedEmojiFeedback2,
        formType,
      });
      await feedback2.save();
    } else if (formType === "form3") {
      const feedback3 = new Feedback({
        userEmail,
        selectedEmoji: selectedEmojiFeedback3,
        formType,
      });
      await feedback3.save();
    }
    res.status(200).send("Feedback submitted successfully");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  handlePostAllFeedback,
};

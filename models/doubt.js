const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  doubt: {
    type: String,
    required: true,
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;

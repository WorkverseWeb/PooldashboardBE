const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Issue:
 *       type: object
 *       required:
 *         - email
 *         - issue
 *         - doubt
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         issue:
 *           type: string
 *           description: Description of the issue
 *         doubt:
 *           type: string
 *           description: Detailed description of the issue
 */
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

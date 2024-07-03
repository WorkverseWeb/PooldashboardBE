const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - email
 *         - groupname
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the group
 *         groupname:
 *           type: array
 *           items:
 *             type: string
 *           description: The names of the group
 *       example:
 *         email: "example@example.com"
 *         groupname: ["group1", "group2"]
 */
const groupSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  groupname: { type: [String], required: true },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;

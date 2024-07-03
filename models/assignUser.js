const mongoose = require("mongoose");

/**
 * @swagger
 * tags:
 *   name: AssignUsers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignUser:
 *       type: object
 *       required:
 *         - auName
 *         - auEmail
 *         - auGroup
 *         - auSkills
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the assignUser
 *         auName:
 *           type: string
 *           description: AssignUser's name
 *         auEmail:
 *           type: string
 *           description: AssignUser's email
 *         auGroup:
 *           type: string
 *           description: AssignUser's group
 *         auSkills:
 *           type: array
 *           items:
 *             type: string
 *           description: AssignUser's skills
 *         auPlaying:
 *           type: boolean
 *           description: Is assignUser playing
 *         auChatting:
 *           type: boolean
 *           description: Is assignUser chatting
 *         auFinishedGame:
 *           type: boolean
 *           description: Has assignUser finished game
 *         auActiveUser:
 *           type: boolean
 *           description: Is assignUser active
 *       example:
 *         _id: 665dc92ee9cc985206d3fef9
 *         auName: John Doe
 *         auEmail: johndoe@example.com
 *         auGroup: group1
 *         auSkills: ["skill1", "skill2"]
 *         auPlaying: false
 *         auChatting: false
 *         auFinishedGame: false
 *         auActiveUser: true
 */

const assignUserSchema = new mongoose.Schema(
  {
    auName: { type: String, required: true },
    auEmail: { type: String, required: true, unique: true },
    auGroup: { type: String, required: true },
    auSkills: { type: [String], required: true },
    auPlaying: { type: Boolean, default: false },
    auChatting: { type: Boolean, default: false },
    auFinishedGame: { type: Boolean, default: false },
    auActiveUser: { type: Boolean, default: true },
    auWIP: { type: [String] },
    addedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AssignUser = mongoose.model("AssignUser", assignUserSchema);

module.exports = AssignUser;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  handleGetAllAssignUser,
  handlePostAllAssignUser,
} = require("../controllers/assignUser");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /assignUsers:
 *   get:
 *     summary: Get users assigned by a specific user.
 *     tags: [AssignUsers]
 *     parameters:
 *       - in: query
 *         name: authenticatedUserEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the authenticated user.
 *     responses:
 *       '200':
 *         description: Successfully retrieved assigned users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       auName:
 *                         type: string
 *                         description: The name of the assigned user.
 *                       auEmail:
 *                         type: string
 *                         description: The email of the assigned user.
 *                       auSkills:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: List of skills of the assigned user.
 *                       auGroup:
 *                         type: string
 *                         description: The group to which the user belongs.
 *                       addedBy:
 *                         type: string
 *                         description: The email of the user who added this user.
 *       '400':
 *         description: Bad request - Authenticated user email is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       '404':
 *         description: Not found - No users found assigned by this user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.get("/", handleGetAllAssignUser);

/**
 * @swagger
 * /assignUsers:
 *   post:
 *     summary: Assign users or upload users from file
 *     tags: [AssignUsers]
 *     description: >
 *       This endpoint allows assigning users or uploading user data from a file,
 *       either individually or in bulk. It also updates user slots based on skills selected.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: authenticatedUserEmail
 *         required: true
 *         type: string
 *         description: Email of the authenticated user making the request.
 *       - in: formData
 *         name: auName
 *         type: string
 *         description: Name of the user (required for individual assignment).
 *       - in: formData
 *         name: auEmail
 *         type: string
 *         description: Email of the user (required for individual assignment).
 *       - in: formData
 *         name: auSkills
 *         type: string
 *         description: Comma-separated list of skills (required for individual assignment).
 *       - in: formData
 *         name: auGroup
 *         type: string
 *         description: Group of the user (required for individual assignment).
 *       - in: formData
 *         name: isClicked
 *         type: string
 *         description: JSON object indicating clicked skills (required if file is uploaded).
 *       - in: formData
 *         name: file
 *         type: file
 *         description: Excel file containing user data (required if individual data is not provided).
 *     responses:
 *       201:
 *         description: User(s) assigned successfully.
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             newAssignUser:
 *               type: object
 *               description: Details of newly assigned user (for individual assignment).
 *       400:
 *         description: Invalid request format.
 *       409:
 *         description: Conflict - User(s) already exist with provided email(s) (for bulk upload).
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             duplicates:
 *               type: array
 *               items:
 *                 type: string
 *                 example: user@example.com
 *       500:
 *         description: Internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Failed to update slot quantities.
 */
router.post("/", upload.single("file"), handlePostAllAssignUser);

module.exports = router;

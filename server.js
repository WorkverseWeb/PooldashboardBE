const express = require("express");
const mongoose = require("mongoose");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const CryptoJS = require("crypto-js");
require("dotenv").config();

// Initialize Express app
const app = express();

const userRouter = require("./routes/user");
const preferenceRouter = require("./routes/preferences");
const imageRouter = require("./routes/upload");
const feedbackRouter = require("./routes/feedback");
const issueRouter = require("./routes/doubt");
const Issue = require("./models/doubt");
const orderRouter = require("./routes/razorpay");
const groupRouter = require("./routes/group");
const slotRouter = require("./routes/slot");
const assignUserRouter = require("./routes/assignUser");
const initialslotRouter = require("./routes/initialSlot");

// middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      await Issue.collection.dropIndex("email_1");
      console.log("Unique index on email dropped successfully");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("Index not found, nothing to drop");
      } else {
        console.error("Error dropping index:", err);
      }
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API Documentation with Swagger",
    },
    servers: [
      {
        url: process.env.BASE_URL,
      },
    ],
  },
  apis: ["./server.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/upload", imageRouter);
app.use("/users", userRouter);
app.use("/api/preferences", preferenceRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/issues", issueRouter);
app.use("/order", orderRouter);
app.use("/group", groupRouter);
app.use("/slots", slotRouter);

app.use("/assignUsers", assignUserRouter);
app.use("/initialslot", initialslotRouter);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// user

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *       properties:
 *         fullName:
 *           type: string
 *         number:
 *           type: number
 *         poolForCreator:
 *           type: string
 *         organization:
 *           type: string
 *         designation:
 *           type: string
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         linkdeInURL:
 *           type: string
 *         status:
 *           type: array
 *           items:
 *             type: string
 *   responses:
 *     200:
 *       description: Success
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '404':
 *         description: Users not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User created successfully
 *       '400':
 *         description: Bad request. Missing or invalid fields.
 */

/**
 * @swagger
 * /users/{email}:
 *   patch:
 *     summary: Update a user by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request. Missing or invalid fields.
 *       '404':
 *         description: User not found
 */

// upload

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileImage:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         imageUrl:
 *           type: string
 *           description: URL of the profile image stored in AWS S3.
 *           example: https://your-bucket-name.s3.amazonaws.com/profileImages/1627888289147-image.png
 *         email:
 *           type: string
 *           description: Email associated with the profile image.
 *           example: user@example.com
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a profile image
 *     description: Upload a profile image to S3 and save the image URL to the database.
 *     tags:
 *       - Profile Image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The image file to upload.
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         description: The email associated with the profile image.
 *         required: true
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               description: URL of the uploaded image
 *               example: https://your-bucket-name.s3.amazonaws.com/profileImages/1627888289147-image.png
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileImage'
 *       400:
 *         description: Missing email or file
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Missing email or file
 *       500:
 *         description: Failed to upload image
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Failed to upload image
 * /upload/{email}:
 *   get:
 *     summary: Get profile image by email
 *     description: Fetch the profile image URL by email.
 *     tags:
 *       - Profile Image
 *     parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         required: true
 *         description: The email associated with the profile image.
 *     responses:
 *       200:
 *         description: Image fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 60d21b4967d0d8992e610c85
 *             imageUrl:
 *               type: string
 *               example: https://your-bucket-name.s3.amazonaws.com/profileImages/1627888289147-image.png
 *             email:
 *               type: string
 *               example: user@example.com
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileImage'
 *       404:
 *         description: Image not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Image not found
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Internal server error
 */

// slot

/**
 * @swagger
 * tags:
 *   name: Slot
 *   description: Operations related to user slots
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Slot:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email address of the user
 *         AllProducts:
 *           type: object
 *           properties:
 *             level1:
 *               type: number
 *               default: 0
 *             level2:
 *               type: number
 *               default: 0
 *             level3:
 *               type: number
 *               default: 0
 *             level4:
 *               type: number
 *               default: 0
 *             level5:
 *               type: number
 *               default: 0
 *             level6:
 *               type: number
 *               default: 0
 *             level7:
 *               type: number
 *               default: 0
 *             level8:
 *               type: number
 *               default: 0
 *             level9:
 *               type: number
 *               default: 0
 *             allLevels:
 *               type: number
 *               default: 0
 *             paymentStatus:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [Success, Failed, Pending, Reset]
 *                 default: Pending
 *         TotalAmount:
 *           type: number
 *           description: Total amount of the slot
 */

/**
 * @swagger
 * /slots/{email}:
 *   get:
 *     summary: Get user's slot details by email
 *     description: Retrieve the slot details for a specific user using their email address
 *     tags: [Slot]
 *     parameters:
 *       - in: path
 *         name: email
 *         description: The email address of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Slot details retrieved successfully
 *       '404':
 *         description: Slot not found for the specified user
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /slots:
 *   post:
 *     summary: Add a new slot
 *     tags: [Slot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slot'
 *     responses:
 *       200:
 *         description: Slot created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /slots/{email}:
 *   patch:
 *     summary: Update an existing slot
 *     tags: [Slot]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AllProducts:
 *                 type: object
 *                 properties:
 *                   level1:
 *                     type: number
 *                   level2:
 *                     type: number
 *                   level3:
 *                     type: number
 *                   level4:
 *                     type: number
 *                   level5:
 *                     type: number
 *                   level6:
 *                     type: number
 *                   level7:
 *                     type: number
 *                   level8:
 *                     type: number
 *                   level9:
 *                     type: number
 *                   allLevels:
 *                     type: number
 *               paymentStatus:
 *                 type: string
 *                 enum: [Success, Failed, Pending, Reset]
 *               TotalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: SLot updated successfully
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Internal server error
 */

// preferences

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreferences:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         totalInactive:
 *           type: boolean
 *           description: Email when someone is inactive
 *         totalChatting:
 *           type: boolean
 *           description: Email when someone is not interacting with Neuroda
 *         totalFinishedGame:
 *           type: boolean
 *           description: Email when someone finishes the game
 *         yesToLevelNotification:
 *           type: boolean
 *           description: Notify when a new level is added
 *         yesToProductUpdate:
 *           type: boolean
 *           description: Monthly product updates
 *         yesToSubscribeNewsletter:
 *           type: boolean
 *           description: Subscribe to newsletter
 */

/**
 * @swagger
 * /api/preferences/{email}:
 *   get:
 *     summary: Get user preferences by email
 *     tags: [UserPreferences]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's email
 *     responses:
 *       200:
 *         description: The user preferences
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences'
 *       404:
 *         description: Preferences not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/preferences/{email}:
 *   patch:
 *     summary: Update user preferences by email
 *     tags: [UserPreferences]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalInactive:
 *                 type: boolean
 *               totalChatting:
 *                 type: boolean
 *               totalFinishedGame:
 *                 type: boolean
 *               yesToLevelNotification:
 *                 type: boolean
 *               yesToProductUpdate:
 *                 type: boolean
 *               yesToSubscribeNewsletter:
 *                 type: boolean
 *               email:
 *                 type: string
 *           example:
 *             totalInactive: true
 *             totalChatting: true
 *             totalFinishedGame: true
 *             yesToLevelNotification: false
 *             yesToProductUpdate: false
 *             yesToSubscribeNewsletter: false
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences'
 *       500:
 *         description: Server error
 */

// group

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

/**
 * @swagger
 * /group/{email}:
 *   get:
 *     summary: Get a group by email
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The group's email
 *     responses:
 *       200:
 *         description: The group description by email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: The group was not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 *  /group:
 *   post:
 *     summary: Create or update a group
 *     tags: [Group]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user creating or updating the group
 *               groupname:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of group names
 *     responses:
 *       200:
 *         description: The group was successfully created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /group/{email}:
 *   patch:
 *     summary: Update a group by email
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The group's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupname:
 *                 type: array
 *                 items:
 *                   type: string
 *               removeLast:
 *                 type: boolean
 *             example:
 *               groupname: ["newGroup"]
 *               removeLast: false
 *     responses:
 *       200:
 *         description: The group was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: The group was not found
 *       500:
 *         description: Some server error
 */

// feedback

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *         - userEmail
 *         - selectedEmoji
 *       properties:
 *         userEmail:
 *           type: string
 *           description: The user's email
 *         selectedEmoji:
 *           type: integer
 *           description: The index of the selected emoji
 *       example:
 *         userEmail: user@example.com
 *         selectedEmoji: 2
 */

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit user feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       500:
 *         description: Internal server error
 */

// doubt

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

/**
 * @swagger
 * /api/issues/{email}:
 *   post:
 *     summary: Submit an issue or doubt
 *     tags:
 *       - Issue
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: User's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - issue
 *               - doubt
 *             properties:
 *               issue:
 *                 type: string
 *                 description: Description of the issue
 *               doubt:
 *                 type: string
 *                 description: Detailed description of the issue
 *     responses:
 *       200:
 *         description: Issue submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Issue submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Issue'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please provide all required fields
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error submitting the issue
 */

// assign user

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

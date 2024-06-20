const express = require("express");
const mongoose = require("mongoose");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const axios = require("axios");
require("dotenv").config();

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: Number, required: true },
  poolForCreator: { type: String, required: true },
  organization: { type: String, required: true },
  designation: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  linkdeInURL: String,
  status: { type: [String] },
  totalPurchasedUsers: Number,
  slotsAvailable: Number,
  totalAssignedPlayers: Number,
  group: { type: [String] },
  totalAmountPaid: Number,
  totalWIP: Number,
  invoices: { type: [String] },
  cartAddedProducts: {
    level1: Number,
    level2: Number,
    level3: Number,
    level4: Number,
    level5: Number,
    level6: Number,
    level7: Number,
    level8: Number,
    level9: Number,
    allLevels: Number,
    paymentStatus: { type: [String] },
  },
  cartTotalAmount: Number,
  totalInactive: Boolean,
  totalChatting: Boolean,
  totalFinishedGame: Boolean,
  yesToLevelNotification: Boolean,
  yesToProductUpdate: Boolean,
  yesToSubscribeNewsletter: Boolean,
});

// Create User model
const User = mongoose.model("User", userSchema);

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
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *       properties:
 *         fullName:
 *           type: string
 *         email:
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
 *         totalPurchasedUsers:
 *           type: number
 *         slotsAvailable:
 *           type: number
 *         totalAssignedPlayers:
 *           type: number
 *         group:
 *           type: array
 *           items:
 *             type: string
 *         totalAmountPaid:
 *           type: number
 *         totalWIP:
 *           type: number
 *         invoices:
 *           type: array
 *           items:
 *             type: string
 *         cartAddedProducts:
 *           type: object
 *           properties:
 *             cartTotalAmount:
 *               type: number
 *         totalInactive:
 *           type: boolean
 *           default: false
 *         totalChatting:
 *           type: boolean
 *           default: false
 *         totalFinishedGame:
 *           type: boolean
 *           default: false
 *         yesToLevelNotification:
 *           type: boolean
 *           default: true
 *         yesToProductUpdate:
 *           type: boolean
 *           default: true
 *         yesToSubscribeNewsletter:
 *           type: boolean
 *           default: true
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
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *     
 responses:
 *     200:
 *       description: Success
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
*/

app.get("/users", async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email and status is required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

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
 *       200:
 *         description: User created successfully
 */
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /users/{email}:
 *   patch:
 *     summary: Retrieve a single user by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user email
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.patch("/users/:email", async (req, res) => {
  const { email } = req.params;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's information with data from the form
    user = await User.findOneAndUpdate({ email }, req.body, { new: true });

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const userPreferencesSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  totalInactive: { type: Boolean, default: true },
  totalChatting: { type: Boolean, default: true },
  totalFinishedGame: { type: Boolean, default: true },
  yesToLevelNotification: { type: Boolean, default: false },
  yesToProductUpdate: { type: Boolean, default: false },
  yesToSubscribeNewsletter: { type: Boolean, default: false },
});

const UserPreferences = mongoose.model(
  "UserPreferences",
  userPreferencesSchema
);

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

// Get user preferences by email
app.get("/api/preferences/:email", async (req, res) => {
  try {
    const defaultPreferences = {
      totalInactive: true,
      totalChatting: true,
      totalFinishedGame: true,
      yesToLevelNotification: false,
      yesToProductUpdate: false,
      yesToSubscribeNewsletter: false,
    };

    const preferences = await UserPreferences.findOne({
      email: req.params.email,
    });
    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }

    // Override default preferences with user's preferences
    const mergedPreferences = {
      ...defaultPreferences,
      ...preferences.toObject(),
    };
    res.json(mergedPreferences);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user preferences by email
app.patch("/api/preferences/:email", async (req, res) => {
  try {
    const preferences = await UserPreferences.findOneAndUpdate(
      { email: req.params.email },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ message: "Preferences updated successfully", preferences });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// SLOTS SCHEMA

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

const validStatuses = ["Success", "Failed", "Pending", "Reset"];

const slotSchema = new mongoose.Schema({
  email: { type: String, required: true },
  AllProducts: {
    level1: { type: Number, default: 0 },
    level2: { type: Number, default: 0 },
    level3: { type: Number, default: 0 },
    level4: { type: Number, default: 0 },
    level5: { type: Number, default: 0 },
    level6: { type: Number, default: 0 },
    level7: { type: Number, default: 0 },
    level8: { type: Number, default: 0 },
    level9: { type: Number, default: 0 },
    allLevels: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: validStatuses, default: "Pending" },
  },
  TotalAmount: { type: Number, default: 0 },
});

const Slot = mongoose.model("Slot", slotSchema);

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
app.get("/slots/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const slot = await Slot.findOne({ email });
    if (!slot) {
      return res
        .status(404)
        .json({ error: "Slot not found for the specified user" });
    }
    res.status(200).json(slot);
  } catch (error) {
    console.error("Error retrieving slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
app.post("/slots", async (req, res) => {
  const { email, AllProducts, TotalAmount } = req.body;

  try {
    const newSlot = new Slot({ email, AllProducts, TotalAmount });
    await newSlot.save();
    res.status(200).send("Slot created successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

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
app.patch("/slots/:email", async (req, res) => {
  const { email } = req.params;
  const { AllProducts, paymentStatus, TotalAmount } = req.body;

  try {
    const slot = await Slot.findOne({ email });
    if (!slot) {
      return res.status(404).send("Slot not found");
    }

    Object.keys(AllProducts).forEach((key) => {
      if (AllProducts[key] !== undefined) {
        slot.AllProducts[key] = AllProducts[key];
      }
    });

    const validStatuses = ["Success", "Failed", "Pending", "Reset"];
    if (paymentStatus && validStatuses.includes(paymentStatus)) {
      slot.AllProducts.paymentStatus = paymentStatus;
    }

    if (TotalAmount !== undefined) {
      slot.TotalAmount = TotalAmount;
    }

    await slot.save();
    res.status(200).send("slot updated successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// initial slots
const initialSlotSchema = new mongoose.Schema({
  email: { type: String, required: true },
  AllProducts: {
    level1: { type: Number, default: 0 },
    level2: { type: Number, default: 0 },
    level3: { type: Number, default: 0 },
    level4: { type: Number, default: 0 },
    level5: { type: Number, default: 0 },
    level6: { type: Number, default: 0 },
    level7: { type: Number, default: 0 },
    level8: { type: Number, default: 0 },
    level9: { type: Number, default: 0 },
    allLevels: { type: Number, default: 0 },
  },
});

const InitialSlot = mongoose.model("InitialSlot", initialSlotSchema);

app.get("/initialslot/:email", async (req, res) => {
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
});

app.post("/initialslot", async (req, res) => {
  const { email, AllProducts } = req.body;

  try {
    const newInitSlot = new InitialSlot({ email, AllProducts });
    await newInitSlot.save();
    res.status(200).send("Slot created successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.patch("/initialslot/:email", async (req, res) => {
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
});

// group SCHEMA

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
app.post("/group", async (req, res) => {
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
});

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
app.get("/group/:email", async (req, res) => {
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
});

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
app.patch("/group/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { groupname } = req.body;

    let updatedGroup;

    if (groupname.length === 0) {
      // If groupname array is empty, remove the entire field
      updatedGroup = await Group.findOneAndUpdate(
        { email },
        { $unset: { groupname: "" } },
        { new: true }
      );
    } else {
      // Update groupname array with the new value
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
});

// ASSIGN USER SCHEMA

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
app.get("/assignUsers", async (req, res) => {
  try {
    const { authenticatedUserEmail } = req.query;

    if (!authenticatedUserEmail) {
      return res
        .status(400)
        .json({ message: "Authenticated user email is required" });
    }

    const users = await AssignUser.find({
      addedBy: authenticatedUserEmail.toLowerCase(),
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found assigned by this user" });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching assigned users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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

app.post("/assignUsers", upload.single("file"), async (req, res) => {
  try {
    const authenticatedUserEmail =
      req.body.authenticatedUserEmail.toLowerCase();
    console.log("Authenticated user:", authenticatedUserEmail);

    if (
      req.body.auName &&
      req.body.auEmail &&
      req.body.auSkills &&
      req.body.auGroup
    ) {
      const { auSkills, auEmail, ...userData } = req.body;
      const existingUser = await AssignUser.findOne({
        auEmail: auEmail.toLowerCase(),
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User already exists with this email." });
      }

      const skillsArray = auSkills.split(",").map((skill) => skill.trim());

      const assignUser = new AssignUser({
        ...userData,
        auSkills: skillsArray,
        auEmail: auEmail.toLowerCase(),
        addedBy: authenticatedUserEmail,
        auWIP: ["in-progress"],
      });

      const newAssignUser = await assignUser.save();

      const isClicked = req.body.isClicked
        ? JSON.parse(req.body.isClicked)
        : {};
      for (const [skill, clicked] of Object.entries(isClicked)) {
        if (clicked) {
          const updatedSlot = await updateSlot(authenticatedUserEmail, skill);
          if (!updatedSlot.success) {
            return res
              .status(500)
              .json({ message: "Failed to update slot quantities." });
          }
        }
      }

      return res.status(201).json({ success: true, newAssignUser });
    }

    if (req.file && req.body.isClicked) {
      const fileBuffer = req.file.buffer;
      const skills = JSON.parse(req.body.isClicked);
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);

      const existingEmails = new Set();
      const duplicates = [];

      for (const student of data) {
        const newStudentData = {};
        for (const key in student) {
          if (Object.hasOwnProperty.call(student, key)) {
            let formattedKey = key.toLowerCase();
            if (formattedKey === "name") formattedKey = "auName";
            else if (formattedKey === "email") formattedKey = "auEmail";
            else if (formattedKey === "group") formattedKey = "auGroup";
            newStudentData[formattedKey] = student[key];
          }
        }

        const email = newStudentData.auEmail.toLowerCase();

        if (existingEmails.has(email)) {
          duplicates.push(email);
        } else {
          existingEmails.add(email);
        }
      }

      if (duplicates.length > 0) {
        return res.status(409).json({ success: false, duplicates });
      } else {
        for (const student of data) {
          const newStudentData = {};
          for (const key in student) {
            if (Object.hasOwnProperty.call(student, key)) {
              let formattedKey = key.toLowerCase();
              if (formattedKey === "name") formattedKey = "auName";
              else if (formattedKey === "email") formattedKey = "auEmail";
              else if (formattedKey === "group") formattedKey = "auGroup";
              newStudentData[formattedKey] = student[key];
            }
          }

          const email = newStudentData.auEmail.toLowerCase();
          try {
            const existingUser = await AssignUser.findOne({ auEmail: email });
            if (!existingUser) {
              const assignUser = new AssignUser({
                ...newStudentData,
                auEmail: email,
                auSkills: Object.keys(skills).filter((skill) => skills[skill]),
                addedBy: authenticatedUserEmail,
                auWIP: ["in-progress"],
              });
              await assignUser.save();
            }
          } catch (error) {
            console.error("Error saving user:", error);
          }
        }

        for (const skill in skills) {
          if (skills[skill]) {
            const updatedSlot = await updateSlot(authenticatedUserEmail, skill);
            if (!updatedSlot.success) {
              return res
                .status(500)
                .json({ message: "Failed to update slot quantities." });
            }
          }
        }

        return res
          .status(201)
          .json({ success: true, message: "Users uploaded successfully." });
      }
    }

    return res.status(400).json({ message: "Invalid request format." });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

async function updateSlot(email, skill) {
  try {
    const skillLevelMap = {
      "Creative Problem solving": "level1",
      "Entrepreneurial Mindset": "level2",
      Negotiation: "level3",
      "Story-telling": "level4",
      "First Principles Thinking": "level5",
      "Sharp Remote Communication": "level6",
      Collaboration: "level7",
      "Emotional Intelligence": "level8",
      "Productivity Management": "level9",
      "Entire Game": "allLevels",
    };

    const response = await axios.get(
      `http://localhost:8000/initialslot/${email}`
    );
    const slotDetails = response.data.AllProducts;

    if (skill === "allLevels") {
      for (const skillName in skillLevelMap) {
        const level = skillLevelMap[skillName];
        if (slotDetails[level] > 0) {
          slotDetails[level]--;
        }
      }
    } else {
      const level = skillLevelMap[skill];

      if (level && slotDetails[level] > 0) {
        slotDetails[level]--;
      }
    }

    const slotResponse = await axios.patch(
      `http://localhost:8000/initialslot/${email}`,
      { AllProducts: slotDetails }
    );

    if (slotResponse.status !== 200) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating slot quantities:", error);
    return { success: false };
  }
}

// doubt form

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
 *           description: User's email address (unique)
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
    unique: true,
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

app.post("/api/issues/:email", async (req, res) => {
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
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

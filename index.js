const express = require("express");
const mongoose = require("mongoose");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://priyanka:Priyanka%40workverse@cluster0.4h3mjjj.mongodb.net/Pooldashboard",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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
    wholeGame: Number,
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
 *
 *     Slot:
 *       type: object
 *       properties:
 *         level1:
 *           type: number
 *         level2:
 *           type: number
 *         level3:
 *           type: number
 *         level4:
 *           type: number
 *         level5:
 *           type: number
 *         level6:
 *           type: number
 *         level7:
 *           type: number
 *         level8:
 *           type: number
 *         level9:
 *           type: number
 *         wholeGame:
 *           type: number
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

// /**
//  * @swagger
//  * /users/{email}:
//  *   patch:
//  *     summary: "Update user preferences by email"
//  *     tags: [User]
//  *     parameters:
//  *       - in: path
//  *         name: email
//  *         description: "The email address of the user whose preferences to update"
//  *         required: true
//  *         type: "string"
//  *       - in: "body"
//  *         name: "preferences"
//  *         description: "Preferences to update"
//  *         required: true
//  *         schema:
//  *           type: "object"
//  *           properties:
//  *             totalInactive:
//  *               type: "boolean"
//  *               default: false
//  *             totalChatting:
//  *               type: "boolean"
//  *               default: false
//  *             totalFinishedGame:
//  *               type: "boolean"
//  *               default: false
//  *             yesToLevelNotification:
//  *               type: "boolean"
//  *               default: true
//  *             yesToProductUpdate:
//  *               type: "boolean"
//  *               default: true
//  *             yesToSubscribeNewsletter:
//  *               type: "boolean"
//  *               default: true
//  *     responses:
//  *       200:
//  *         description: A single user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       404:
//  *         description: "User not found"
//  *       500:
//  *         description: "Internal server error"
//  */
// app.patch("/users/:email", async (req, res) => {
//   try {
//     const {
//       email,
//       totalInactive,
//       totalChatting,
//       totalFinishedGame,
//       yesToLevelNotification,
//       yesToProductUpdate,
//       yesToSubscribeNewsletter,
//     } = req.body;

//     let userPreference = await User.findOne({ email });

//     if (!userPreference) {
//       userPreference = new User({ email });
//     }

//     userPreference.totalInactive = totalInactive;
//     userPreference.totalChatting = totalChatting;
//     userPreference.totalFinishedGame = totalFinishedGame;
//     userPreference.yesToLevelNotification = yesToLevelNotification;
//     userPreference.yesToProductUpdate = yesToProductUpdate;
//     userPreference.yesToSubscribeNewsletter = yesToSubscribeNewsletter;

//     await userPreference.save();

//     res.status(200).json({ message: "User preferences updated successfully" });
//   } catch (error) {
//     console.error("Error updating user preferences:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

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

/**
 * @swagger
 * tags:
 *   name: cart
 *   description: Operations related to user carts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email address of the user
 *         cartAddedProducts:
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
 *             wholeGame:
 *               type: number
 *               default: 0
 *             paymentStatus:
 *               type: array
 *               items:
 *                 type: string
 *               default: ["Success", "Failed", "Reset"]
 */

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  cartAddedProducts: {
    level1: { type: Number, default: 0 },
    level2: { type: Number, default: 0 },
    level3: { type: Number, default: 0 },
    level4: { type: Number, default: 0 },
    level5: { type: Number, default: 0 },
    level6: { type: Number, default: 0 },
    level7: { type: Number, default: 0 },
    level8: { type: Number, default: 0 },
    level9: { type: Number, default: 0 },
    wholeGame: { type: Number, default: 0 },
    paymentStatus: { type: [String], default: ["Success", "Failed", "Reset"] },
  },
});
const Cart = mongoose.model("Cart", cartSchema);

/**
 * @swagger
 * /carts/{email}:
 *   get:
 *     summary: Get user's cart details by email
 *     description: Retrieve the cart details for a specific user using their email address
 *     tags: [cart]
 *     parameters:
 *       - in: path
 *         name: email
 *         description: The email address of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Cart details retrieved successfully
 *       '404':
 *         description: Cart not found for the specified user
 *       '500':
 *         description: Internal server error
 */
app.get("/carts/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res
        .status(404)
        .json({ error: "Cart not found for the specified user" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /carts/{email}:
 *   patch:
 *     summary: Update user's cart details
 *     description: Update the cart details for the specified user by email
 *     tags: [cart]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           description: The email address of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       '200':
 *         description: Successfully updated cart details
 *       '400':
 *         description: Invalid request body
 *       '500':
 *         description: Internal server error
 */
app.patch("/carts/:email", async (req, res) => {
  const { email } = req.params;
  const { cartData } = req.body;

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({ error: "User not found" });
    }

    cart.cartAddedProducts = cartData;

    await cart.save();

    res.status(200).json({ message: "Cart details updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Slots schema

const slotSchema = new mongoose.Schema({
  level1: Number,
  level2: Number,
  level3: Number,
  level4: Number,
  level5: Number,
  level6: Number,
  level7: Number,
  level8: Number,
  level9: Number,
  wholeGame: Number,
});

const Slot = mongoose.model("Slot", slotSchema);

/**
 * @swagger
 * /slots:
 *   get:
 *     tags: [Slot]
 *     description: Get all slots
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/slots", async (req, res) => {
  try {
    const slots = await Slot.find();
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /slots:
 *   post:
 *     tags: [Slot]
 *     description: Create a new slot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level1:
 *                 type: number
 *               level2:
 *                 type: number
 *               level3:
 *                 type: number
 *               level4:
 *                 type: number
 *               level5:
 *                 type: number
 *               level6:
 *                 type: number
 *               level7:
 *                 type: number
 *               level8:
 *                 type: number
 *               level9:
 *                 type: number
 *               wholeGame:
 *                 type: number
 *     responses:
 *       201:
 *         description: Slot created
 */
app.post("/slots", async (req, res) => {
  const slot = new Slot(req.body);

  try {
    const newSlot = await slot.save();
    res.status(201).json(newSlot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// assign User

const assignUserSchema = new mongoose.Schema({
  auName: { type: String, required: true },
  auEmail: { type: String, required: true, unique: true },
  auGroup: { type: String, required: true },
  auSkills: { type: [String], required: true },
  auPlaying: { type: Boolean, default: false },
  auChatting: { type: Boolean, default: false },
  auFinishedGame: { type: Boolean, default: false },
  auActiveUser: { type: Boolean, default: true },
});

const AssignUser = mongoose.model("AssignUser", assignUserSchema);

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
 * tags:
 *   name: AssignUsers
 */

/**
 * @swagger
 * /assignUsers:
 *   get:
 *     summary: Returns the list of all assignUsers
 *     tags: [AssignUsers]
 *     responses:
 *       200:
 *         description: The list of assignUsers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AssignUser'
 */
app.get("/assignUsers", async (req, res) => {
  try {
    const assignUsers = await AssignUser.find();
    res.status(200).json(assignUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /assignUsers/{auEmail}:
 *   get:
 *     summary: Get the assignUser by email
 *     tags: [AssignUsers]
 *     parameters:
 *       - in: path
 *         name: auEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: The assignUser email
 *     responses:
 *       200:
 *         description: The assignUser description by email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignUser'
 *       404:
 *         description: The assignUser was not found
 */
app.get("/assignUsers/:auEmail", async (req, res) => {
  try {
    const assignUser = await AssignUser.findOne({
      auEmail: req.params.auEmail,
    });
    if (assignUser) {
      res.status(200).json(assignUser);
    } else {
      res.status(404).json({ message: "AssignUser not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /assignUsers:
 *   post:
 *     summary: Create a new assignUser
 *     tags: [AssignUsers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignUser'
 *     responses:
 *       201:
 *         description: The assignUser was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignUser'
 *       400:
 *         description: Bad request
 */
app.post("/assignUsers", async (req, res) => {
  const assignUser = new AssignUser(req.body);
  try {
    const newAssignUser = await assignUser.save();
    res.status(201).json(newAssignUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

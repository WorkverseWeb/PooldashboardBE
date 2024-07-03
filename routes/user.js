const express = require("express");
const router = express.Router();
const {
  handleGetAllUser,
  handlePostAllUser,
  handlePatchAllUser,
} = require("../controllers/user");

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

router.get("/", handleGetAllUser);

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
router.post("/", handlePostAllUser);

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
router.patch("/:email", handlePatchAllUser);

module.exports = router;

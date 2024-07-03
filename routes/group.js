const express = require("express");
const router = express.Router();
const {
  handleGetAllGroup,
  handlePostAllGroup,
  handlePatchAllGroup,
} = require("../controllers/group");

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
router.get("/:email", handleGetAllGroup);

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
router.post("/", handlePostAllGroup);

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
router.patch("/:email", handlePatchAllGroup);

module.exports = router;

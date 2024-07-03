const express = require("express");
const router = express.Router();
const {
  handleGetAllSlot,
  handlePostAllSlot,
  handlePatchAllSlot,
} = require("../controllers/slot");

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
router.get("/:email", handleGetAllSlot);

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
router.post("/", handlePostAllSlot);

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
router.patch("/:email", handlePatchAllSlot);

module.exports = router;

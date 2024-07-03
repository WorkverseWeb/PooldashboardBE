const express = require("express");
const router = express.Router();
const {
  handleGetAllPreferences,
  handlePatchAllPreferences,
} = require("../controllers/preferences");

router.get("/:email", handleGetAllPreferences);
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
router.patch("/:email", handlePatchAllPreferences);

module.exports = router;

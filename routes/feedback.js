const express = require("express");
const router = express.Router();
const { handlePostAllFeedback } = require("../controllers/feedback");

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
router.post("/", handlePostAllFeedback);

module.exports = router;

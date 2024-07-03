const express = require("express");
const router = express.Router();
const { handlePostAllDoubt } = require("../controllers/doubt");

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

router.post("/:email", handlePostAllDoubt);

module.exports = router;

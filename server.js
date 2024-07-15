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
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

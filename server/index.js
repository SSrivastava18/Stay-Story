const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");
const commentRoute = require("./routes/commentRoute.js");
const fileUpload = require("express-fileupload");

const dbUrl = process.env.ATLASDBURL || "mongodb://localhost:27017/staystory";
const port = process.env.PORT || 2000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// DB Connection
async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("DB Connected!");
  } catch (err) {
    console.error("Error connecting to DB:", err);
    process.exit(1); // Exit the process if DB connection fails
  }
}

main();

// Routes
app.use("/review", reviewRoute);
app.use("/user", userRoute);
app.use("/review/:id/comments", commentRoute);

// Generic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ success: false, message: "Something went wrong" });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

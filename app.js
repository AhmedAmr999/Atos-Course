const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const examEngineRoutes = require("./Routes/examDefinitionRoute");
const examInstanceRoutes = require("./Routes/examInstanceRoute");
const mongoose = require("mongoose");
const Notification = require("../NotificationEngineService/Models/notificationModel");
const HttpError = require("./middleWare/http-error");

const app = express();

app.use(bodyParser.json());
app.use("/exams/examDefinition", cors());
app.use("/exams/examDefinition", examEngineRoutes);

app.use("/exams/examIntsance", cors());
app.use("/exams/examIntsance", examInstanceRoutes);
const mongoDBUrl =
  "mongodb+srv://ahmed:test123@notificationservice.ap8rqj4.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Log connection events
const dbConnection = mongoose.connection;
dbConnection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
dbConnection.once("open", () => {
  console.log("MongoDB connection opened");
});
dbConnection.on("disconnected", () => {
  console.log("MongoDB connection disconnected");
});

app.get("/exams/notifications", async (req, res, next) => {
  try {
    console.log("enter");
    const notification = await Notification.find();
    res.json({ notification });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

app.use(express.json());
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(3122, () => {
  console.log("port 3122 has started");
});

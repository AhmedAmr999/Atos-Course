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

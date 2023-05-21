const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const questionsRoutes = require("./Routes/questionsRoutes");
const HttpError = require("./Models/http-error");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use("/questions", cors());
app.use("/questions", questionsRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

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

app.listen(3000, () => {
  console.log("Server Started on port 3000");
});

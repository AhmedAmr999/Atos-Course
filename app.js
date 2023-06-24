const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const notificationsRouter = require("./Routes/notificationRoute");
const cors = require("cors");
const consumer = require("./consumer/index");
const app = express();

app.use(bodyParser.json());
app.use("/notifications", cors());
app.use("/notifications", notificationsRouter);
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_NOTIFICATIONS_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    // Start the Kafka consumer
    consumer();

    // Start the server
    app.listen(3456, () => {
      console.log("Server started on port 3456");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

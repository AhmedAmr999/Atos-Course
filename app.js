const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const questionsRouter = require("./Routes/QuestionsRoute");
const app = express();

app.use(bodyParser.json());
app.use("/questions", cors());
app.use("/questions", questionsRouter);
require("dotenv").config();


mongoose
  .connect(process.env.MONGO_QUESTIONS_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Start the server
    app.listen(3000, () => {
      console.log("Server Started on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });

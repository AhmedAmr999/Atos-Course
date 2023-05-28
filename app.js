const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const questionsRouter = require("./Routes/QuestionsRoute");
const app = express();

app.use(bodyParser.json());
app.use("/questions", cors());
app.use("/questions", questionsRouter);

mongoose
  .connect(
    "mongodb+srv://ahmedamr:ahmed1234@questionsandanswers.vk7h8jw.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server Started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

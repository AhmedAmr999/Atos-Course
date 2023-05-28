const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRouter");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use("/users", cors());
app.use("/users", userRoutes);

mongoose
  .connect(
    "mongodb+srv://ahmedamr:ahmed1234@cluster0.jxx9sg6.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    app.listen(3002, () => {
      console.log("Server Started on port 3002");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authenticate = require("./middleware/authenticate");
const userRoute = require("./routes/userRoute");
const getAllRoute = require("./routes/getAllRoute");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use("/api/profile", cors());
app.use("/api", cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/api/profile", authenticate, userRoute);

app.use("/api", getAllRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.listen(8000, () => {
  console.log("Server up and running on port 8000.");
});

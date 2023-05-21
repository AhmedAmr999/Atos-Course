const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const express = require("express");
const app = express();

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  userType: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);


const db2 = mongoose.createConnection(
  "mongodb+srv://ahmedmaso:ahmed1234@users.fogccmi.mongodb.net/USERS?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = db2.model("User", userSchema);

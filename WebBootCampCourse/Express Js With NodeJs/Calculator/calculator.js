//jshint eversion:6
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//urlencoded get data from html form
//extended allow to post nested objects
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  var num1=Number(req.body.num1);
  var num2=Number(req.body.num2);
  var result=num1+num2;
  console.log(result);
  res.send("The result of the calculator is "+ result);
});

app.listen(3000, () => {
  console.log("server port 3000 is running");
});

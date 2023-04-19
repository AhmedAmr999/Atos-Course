//jshint esversion: 6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https=require("https");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
  //console.log(req.body.firstName);
  //console.log(req.body.lastName);
  //console.log(req.body.email);
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    },
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/30776e16c0";
  const options={
    method:"POST",
    
  }
  https.request(url,options,(response)=>{

  })

});
app.listen(3000, () => {
  console.log("Port 3000 is running");
});

//API_KEY
//84a1c15b20810abcf6a138bf143fd22c-us17

//listID
//30776e16c0

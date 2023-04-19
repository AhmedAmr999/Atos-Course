const express = require("express");

const https = require("https");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "57d44092239089350a273051c81672ec";
  const url =
    "https://samples.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "";
  https.get(url, (response) => {
    console.log(response.statusCode);
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      //console.log(weatherData);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
      console.log(temp);
      res.write("<p>the weather description is " + weatherDescription + "</p>");
      res.write("<h1> the tempreture in "+query+ " is " + temp + "</h1>");
      res.write("<img src=" + imageURL + " >");
      res.send();
    });
  });
  //res.send("server is up and running");
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

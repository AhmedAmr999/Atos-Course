//jshint eversion:6
const express = require("express");
const bodyParser = require("body-parser");

const app = express();


app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post('/',(req,res)=>{
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var result = weight / (height * height);
    console.log(result);
    res.send('THE BMI VALUE IS = '+result);
});

app.listen(3000,()=>{
    console.log('port 3000 is running');
})
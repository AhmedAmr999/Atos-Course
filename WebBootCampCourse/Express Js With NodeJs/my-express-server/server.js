//jshint eversion:6

const express= require("express");

const app=express();

app.get("/",function(request,response){
    console.log('the request is = ',request);
    response.send("<h1>hello</h1>");
});


app.get("/contact",function(req,res){
    res.send("<h1>contact Me at ahmed@gmail.com</h1>");
});

app.get("/about", function (req, res) {
  res.send("<h1>My name is Ahmed Amr</h1>");
});

app.get("/hobbies", function (req, res) {
  res.send("<h1>My hobby is badminton</h1>");
});

app.listen(3000,function(){
    console.log('server started on port 3000');
});
//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

console.log(md5("123456"));
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String,
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

userSchema.plugin(passportLocalMongoose);

const UserModel = new mongoose.model("User", userSchema);

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  //   const username = req.body.username;
  //   const password = req.body.password;
  //   UserModel.findOne({ email: username })
  //     .then((foundUser) => {
  //       if (foundUser) {
  //         bcrypt
  //           .compare(password, foundUser.password)
  //           .then((result) => {
  //             if (result === true) {
  //               res.render("secrets");
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

// app.get("/secrets", (req, res) => {
//   if (req.isAuthenticated) {
//     res.render("secrets");
//   } else {
//     res.redirect("/login");
//   }
// });
app.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/secrets", (req, res) => {
  UserModel.find({ secret: { $ne: null } })
    .then((foundUsers) => {
      res.render("secrets", { userWithSecrets: foundUsers });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", (req, res) => {
  const submittedSecret = req.body.secret;
  console.log(req.user._id);
  UserModel.findById(req.user._id)
    .then((foundUser) => {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save().then(() => {
          res.redirect("/secrets");
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/register", (req, res) => {
  //   bcrypt
  //     .hash(req.body.password, saltRounds)
  //     .then((hash) => {
  //       const newUser = new UserModel({
  //         email: req.body.username,
  //         password: hash,
  //       });
  //       newUser
  //         .save()
  //         .then(() => {
  //           res.render("secrets");
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  UserModel.register({ username: req.body.username }, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/register");
    });
});

app.listen(3000, () => {
  console.log("Server Started on port 3000");
});

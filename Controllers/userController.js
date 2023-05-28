const expressValidator = require("express-validator");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const HTTPError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HTTPError("fetching users failed please try again later ", 500)
    );
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HTTPError("Invalid inputs passed,please check your data..", 422)
    );
  }
  const { username, password, userType } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (error) {
    return next(new HTTPError("SignUp Failed Please Try Again", 500));
  }

  if (existingUser) {
    return next(new HTTPError("User Already Exists,Please Login Instead", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.log(error);
    return next(new HTTPError("Could Not Create User,Please Try Again", 500));
  }

  const newUser = new User({
    username,
    password: hashedPassword,
    userType,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HTTPError("SignUp Failed,please Try Again", 500));
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        userType: newUser.userType,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HTTPError("SignUp Failed,please Try Again", 500));
  }

  res.status(201).json({ message: "success", userType, token });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (error) {
    return next(new HTTPError("Login Failed Please Try Again", 500));
  }
  if (!existingUser) {
    return next(new HTTPError("Invalid Credentials, Please Try Again", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HTTPError(
        "Login Failed Please check your credentials and Try Again",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(new HTTPError("Invalid credentials and Try Again", 401));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        username: existingUser.username,
        userType: existingUser.userType,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HTTPError("Login Failed,please Try Again", 500));
  }

  res
    .status(201)
    .json({ message: "success", token, userType: existingUser.userType });
};

const getUserById = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const secret = "supersecret_dont_share";
  let token = authorizationHeader.slice(7);
  let userId, username, userType;
  try {
    const decoded = jwt.verify(token, secret);
    userId = decoded.userId;
    username = decoded.username;
    userType = decoded.userType;
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  if (!token) {
    return next(
      new HttpError("Could Not find a user for the provided Id..", 404)
    );
  }
  res.status(201).json({
    message: "success",
    userId,
    username,
    userType,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;

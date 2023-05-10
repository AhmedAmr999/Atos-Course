const HTTPError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const DUMMY_USERS = [
  // {
  //   id: "u1",
  //   name: "ahmed amr",
  //   email: "test@test.com",
  //   password: "testers",
  // },
];

const getUsers = async (req, res, next) => {
  let users;
  //return alll execpt password
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

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HTTPError("SignUp Failed Please Try Again Later", 422));
  }

  if (existingUser) {
    return next(new HTTPError("User Already Exists please Login..", 422));
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HTTPError("Could Not Create User,please try again ..", 500)
    );
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HTTPError("creating user failed please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HTTPError("creating user failed please try again", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HTTPError("Login Failed Please Try Again Later", 500));
  }

  if (!existingUser) {
    return next(new HTTPError("Invalid Credentials , Could Not Log In..", 401));
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HTTPError("Could Not Log In,please check ypur credentials..", 500)
    );
  }
  if (!isValidPassword) {
    return next(new HTTPError("Invalid Credentials , Could Not Log In..", 401));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HTTPError("logging failed please try again", 500));
  }
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;

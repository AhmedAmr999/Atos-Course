const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/usersControllers");

const router = express.Router();
//router.get("/", usersController.getUsers);

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("userType").not().isEmpty(),
  ],
  usersController.signup
);

router.post(
  "/login",
  [check("username").not().isEmpty(), check("password").isLength({ min: 6 })],
  usersController.login
);

router.get(
  "/profileInfo",
  [
    check("username").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("userType").not().isEmpty(),
  ],
  usersController.getUserById
);

module.exports = router;

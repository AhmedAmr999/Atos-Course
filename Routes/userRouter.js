const express = require("express");
const userController = require("../Controllers/userController");
const { check } = require("express-validator");

const router = express.Router();

router.get("/", userController.getUsers);
router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("userType").not().isEmpty(),
  ],
  userController.signup
);
router.post(
  "/login",
  [check("username").not().isEmpty(), check("password").isLength({ min: 6 })],
  userController.login
);
router.get("/profileInfo", userController.getUserById);
module.exports = router;

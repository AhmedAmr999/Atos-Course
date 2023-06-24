const express = require("express");
const KeycloakAdminClient = require("keycloak-admin");
const getAllController = require("../controller/getAllUsersController");
const router = express.Router();

router.get("/users", getAllController.postAdmin);

router.get("/teachers", getAllController.getAllTeachers);

router.get("/users/:userId", getAllController.getUserById);
module.exports = router;

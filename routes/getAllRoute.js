const express = require("express");
const KeycloakAdminClient = require("keycloak-admin");
const getAllController = require("../controller/getAllUsersController");
const router = express.Router();

router.get("/users", getAllController.postAdmin);
// router.get("/users/allStudnets", getAllController.getUsersWithToken);
module.exports = router;

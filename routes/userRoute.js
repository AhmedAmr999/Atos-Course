const express = require("express");
const userController = require("../controller/userController");
const KeycloakAdminClient = require("keycloak-admin");

const router = express.Router();

router.get("/", userController.getDecodedToken);

module.exports = router;

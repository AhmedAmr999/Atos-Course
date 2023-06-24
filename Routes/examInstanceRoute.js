const express = require("express");
const { check } = require("express-validator");
const examInstanceController = require("../Controllers/examInstanceController");

const authMiddleware = require("../middleWare/checkAuth");
const router = express.Router();

router.get("/", examInstanceController.getAllExamInstance);

router.post(
  "/addExamInsatnce",
  authMiddleware,
  examInstanceController.addExamInstance
);

router.delete(
  "/:dei",
  authMiddleware,
  examInstanceController.deleteExamInstance
);

router.get(
  "/:userId/generatedLinks/examDefinitionId/:examdefId",
  examInstanceController.getUserExamIntsance
);

router.get("/:userId", examInstanceController.getAllUserExamInstance);
router.patch(
  "/:userId/updateExamInstance/:examInstId",
  examInstanceController.updateExamInstance
);

router.get(
  "/singleExamInstance/:examInsatnceId",
  examInstanceController.getSingleExamInstance
);
module.exports = router;

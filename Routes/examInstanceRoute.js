const express = require("express");
const { check } = require("express-validator");
const examInstanceController = require("../Controllers/examInstanceController");
const router = express.Router();

router.get("/", examInstanceController.getAllExamInstance);

router.post("/addExamInsatnce", examInstanceController.addExamInstance);

router.delete("/:dei", examInstanceController.deleteExamInstance);

router.get(
  "/:userId/generatedLinks/examDefinitionId/:examdefId",
  examInstanceController.getUserExamIntsance
);

router.get("/:userId", examInstanceController.getAllUserExamInstance);
router.patch(
  "/:userId/updateExamInstance/:examInstId",
  examInstanceController.updateExamInstance
);

module.exports = router;

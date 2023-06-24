const express = require("express");
const { check } = require("express-validator");
const examDefinitionController = require("../Controllers/examDefinitionController");
const router = express.Router();

router.get("/", examDefinitionController.getAllExamDefinition);

router.post(
  "/addExam",
  [check("question_id").not().isEmpty()],
  examDefinitionController.addExamDefinition
);

router.delete("/:edid", examDefinitionController.deleteExamDefinition);

module.exports = router;

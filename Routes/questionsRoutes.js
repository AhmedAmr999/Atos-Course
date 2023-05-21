const express = require("express");
const { check } = require("express-validator");
const questionsController = require("../controllers/questionsControllers");

const router = express.Router();

router.post(
  "/addQuestion",
  [
    check("questionName").not().isEmpty(),
    check("category").not().isEmpty(),
    check("subcategory").not().isEmpty(),
    check("mark").not().isEmpty(),
    check("expectedTime").not().isEmpty(),
    check("correctAnswers").not().isEmpty(),
    check("answers").not().isEmpty(),
    check("creatorId").not().isEmpty(),
  ],
  questionsController.addQuestion
);

router.patch(
  "/updateQuestion/:qid",
  [
    check("questionName").not().isEmpty(),
    check("category").not().isEmpty(),
    check("subcategory").not().isEmpty(),
    check("mark").not().isEmpty(),
    check("expectedTime").not().isEmpty(),
    check("correctAnswers").not().isEmpty(),
    check("answers").not().isEmpty(),
  ],
  questionsController.updateQuestion
);

router.delete("/deleteQuestion/:qid", questionsController.deleteQuestion);

router.get("/:qid", questionsController.getSingleQuestion);

router.get("/", questionsController.getAllQuestions);

router.get("/:qid/Answers", questionsController.getAnswersOfQuestion);

module.exports = router;

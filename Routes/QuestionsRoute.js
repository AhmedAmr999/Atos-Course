const express = require("express");
const questionController = require("../Controllers/QuestionsController");
const { check } = require("express-validator");

const router = express.Router();

router.get("/", questionController.getAllQuestions);


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
  questionController.addQuestion
);

router.get("/:qid/Answers", questionController.getAnswersOfQuestion);

router.delete("/deleteQuestion/:qid", questionController.deleteQuestion);

router.get("/:qid", questionController.getSingleQuestion);
router.get("/Answer/:aid", questionController.getSingleAnswer);

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
  questionController.updateQuestion
);

module.exports = router;

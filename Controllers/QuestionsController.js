const HttpError = require("../Models/http-error");
const expressValidator = require("express-validator");
const { validationResult } = require("express-validator");
const Question = require("../Models/QuestionModel");
const Answer = require("../Models/AnswersModel");

const saveAnswers = async (questionId, answers, correctAnswer) => {
  try {
    const existingAnswers = await Answer.findOne({ question: questionId });

    if (existingAnswers) {
      existingAnswers.answers = answers;
      existingAnswers.correctAnswers = correctAnswer;
      return await existingAnswers.save();
    } else {
      const newAnswers = new Answer({
        answers: answers,
        correctAnswers: correctAnswer,
        question: questionId,
      });
      return await newAnswers.save();
    }
  } catch (e) {
    console.log(e);
  }
};

const getAllQuestions = async (req, res, next) => {

  const User_Type = req.user.User_Type;
  if (User_Type !== "TEACHER") {
    return res.status(403).json({ message: "Access denied" });
  }

  const page = req.query.page || 1; 
  const perPage = 3;

  let totalQuestions;
  let questions;
  try {
    totalQuestions = await Question.countDocuments();
    questions = await Question.find()
      .skip((page - 1) * perPage) 
      .limit(perPage);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Fetching questions failed, please try again later", 500)
    );
  }

  res.json({
    questions,
    currentPage: page,
    totalPages: Math.ceil(totalQuestions / perPage),
  });
};

const addQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }
  const User_Type = req.user.User_Type;

  if (User_Type === "STUDENT") {
    return res.status(403).json({ message: "Access denied" });
  }
  const {
    questionName,
    category,
    subcategory,
    mark,
    expectedTime,
    correctAnswers,
    answers,
    creatorId,
  } = req.body;

  if (!Array.isArray(answers) || answers.length < 2) {
    return next(
      new HttpError("At least 2 answers are required to add a question", 422)
    );
  }

  if (!Array.isArray(correctAnswers) || correctAnswers.length < 1) {
    return next(
      new HttpError(
        "At least 1 correct answer is required to add a question",
        422
      )
    );
  }

  let existingQuestion;
  try {
    existingQuestion = await Question.findOne({
      questionName: questionName,
    });
  } catch (error) {
    console.log("quuestion exist", error);
    return next(
      new HttpError("Creating Question Failed Please Try Again", 500)
    );
  }

  if (existingQuestion) {
    return next(
      new HttpError(
        "Question Already Exists,Please Create New One Instead",
        422
      )
    );
  }

  const newQuestion = new Question({
    questionName: questionName,
    category: category,
    subcategory: subcategory,
    mark: mark,
    expectedTime: expectedTime,
    creatorId: creatorId,
  });

  try {
    const questionId = await newQuestion.save();
    await saveAnswers(questionId, answers, correctAnswers);
    const getAnswerId = await Answer.findOne({ question: questionId._id });
    await Question.findOneAndUpdate(
      { _id: questionId._id },
      { answersId: getAnswerId._id }
    );
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Creeating Question Failed,please Try Again", 500)
    );
  }

  res.status(201).json({ message: "success" });
};

const getAnswersOfQuestion = async (req, res, next) => {
  let answer;
  const questionId = req.params.qid;
  try {
    answer = await Answer.find({ question: questionId });
  } catch (error) {
    return next(
      new HttpError("something went wrong could not find answers..", 500)
    );
  }
  if (!answer) {
    return next(
      new HttpError("something went wrong could not find answers..", 404)
    );
  }
  res.status(200).json({
    message: "Found Answers Successfully",
    answers: answer.map((ans) => ans.toObject({ getters: true })),
  });
};

const deleteQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }

  const User_Type = req.user.User_Type;

  if (User_Type !== "ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }
  const questionId = req.params.qid;
  let question;
  try {
    question = await Question.findById(questionId);
  } catch (error) {
    return next(
      new HttpError(
        "something went wrong could not find and del question..",
        500
      )
    );
  }
  if (!question) {
    return next(
      new HttpError("something went wrong could not find question..", 404)
    );
  }

  try {
    await Question.findByIdAndRemove(questionId);
    await Answer.deleteMany({ question: questionId });
  } catch (error) {
    return next(
      new HttpError("something went wrong could not delete place..", 500)
    );
  }
  res.status(200).json({
    message: "Question Deleted Successfully",
  });
};

const getSingleQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }
  const questionId = req.params.qid;
  let question;
  try {
    question = await Question.findById(questionId);
  } catch (error) {
    return next(
      new HttpError("something went wrong could not find question..", 500)
    );
  }
  if (!question) {
    return next(
      new HttpError("something went wrong could not find question..", 404)
    );
  }
  res.status(200).json({
    message: "Found Question Successfully",
    question: question.toObject({ getters: true }),
  });
};

const updateQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed, please check your data"),
      422
    );
  }

  const User_Type = req.user.User_Type;

  if (User_Type !== "TEACHER") {
    return res.status(403).json({ message: "Access denied" });
  }

  const {
    questionName,
    category,
    subcategory,
    mark,
    expectedTime,
    correctAnswers,
    answers,
  } = req.body;

  const questionId = req.params.qid;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return next(new HttpError("Question not found.", 404));
    }
    if (question.creatorId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    question.questionName = questionName;
    question.category = category;
    question.subcategory = subcategory;
    question.mark = mark;
    question.expectedTime = expectedTime;

    await question.save();

    const existingAnswers = await Answer.findOne({ question: questionId });
    existingAnswers.answers = answers;
    existingAnswers.correctAnswers = correctAnswers;
    await existingAnswers.save();

    // Remove deleted answers
    const removedAnswers = existingAnswers.answers.filter(
      (answer) => !answers.includes(answer)
    );
    if (removedAnswers.length > 0) {
      await Answer.deleteMany({ _id: { $in: removedAnswers } });
    }

    res.status(200).json({ question: question.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update question.", 500)
    );
  }
};

const getSingleAnswer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }
  const answerId = req.params.aid;
  let answer;
  try {
    answer = await Answer.findById(answerId);
  } catch (error) {
    return next(
      new HttpError("something went wrong could not find question..", 500)
    );
  }
  if (!answer) {
    return next(
      new HttpError("something went wrong could not find question..", 404)
    );
  }
  res.status(200).json({
    message: "Found answer Successfully",
    answer: answer.toObject({ getters: true }),
  });
};

exports.getAllQuestions = getAllQuestions;
exports.addQuestion = addQuestion;
exports.getAnswersOfQuestion = getAnswersOfQuestion;
exports.deleteQuestion = deleteQuestion;
exports.getSingleQuestion = getSingleQuestion;
exports.updateQuestion = updateQuestion;
exports.getSingleAnswer = getSingleAnswer;

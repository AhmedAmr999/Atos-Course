const HttpError = require("../Models/http-error");
const expressValidator = require("express-validator");
const { validationResult } = require("express-validator");
const Question = require("../Models/questionsModels");
const Answer = require("../Models/answersModes");

const saveAnswers = async (questionId, answers, correctAnswer) => {
  try {
    //insert in db
    const newAnswers = new Answer({
      answers: answers,
      correctAnswers: correctAnswer,
      question: questionId,
    });
    return await newAnswers.save({ questionId, answers, correctAnswer });
  } catch (e) {
    console.log(e);
  }
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
    console.log("the question body ", questionId);
    console.log("question id ", questionId._id);
    await saveAnswers(questionId, answers, correctAnswers);
    const getAnswerId = await Answer.findOne({ question: questionId._id });
    console.log("get AnswerID :", getAnswerId);
    console.log(typeof getAnswerId);
    await Question.findOneAndUpdate(
      { _id: questionId._id }, // filter by user id
      { answersId: getAnswerId._id } // update email
    );
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Creeating Question Failed,please Try Again", 500)
    );
  }

  res.status(201).json({ message: "success" });
};

const updateQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
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

  let question;

  try {
    question = await Question.findById(questionId);
  } catch (error) {
    return next(
      new HttpError("something went wrong could not update question..", 500)
    );
  }
  question.questionName = questionName;
  question.category = category;
  question.subcategory = subcategory;
  question.mark = mark;
  question.expectedTime = expectedTime;
  // question.correctAnswers = correctAnswers;
  // question.answers = answers;

  try {
    await question.save();
    const questionAnswerId = await saveAnswers(
      questionId,
      answers,
      correctAnswers
    );
    console.log("questionAnswerID is ", questionAnswerId);
    const getAnswerId = await Answer.findOne({ question: questionId });
    await Answer.deleteOne(getAnswerId._id);
    console.log("get AnswerID :", getAnswerId._id);
    console.log(typeof getAnswerId);
    await Question.findOneAndUpdate(
      { _id: questionId },
      { answersId: questionAnswerId._id }
    );
  } catch (error) {
    return next(
      new HttpError("something went wrong could not update question..", 500)
    );
  }
  res.status(200).json({ question: question.toObject({ getters: true }) });
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

const getQuestionsOfCreator = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }
  const creatorId = req.params.cid;
  let userWithQuestions;
  try {
    userWithQuestions = await User.findById(userId).populate("places");
    //console.log("the user id in the controller is ", userId);
  } catch (error) {
    return next(
      new HttpError("fetched places failed please try again later..", 500)
    );
  }

  if (!userWithQuestions || userWithQuestions.length === 0) {
    return next(
      new HttpError("Could Not find a places for the provided User Id..", 404)
    );
  }
  res.json({
    places: userWithQuestions.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
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
  console.log(answer);
  res.status(200).json({
    message: "Found Answers Successfully",
    answers: answer.map((ans) => ans.toObject({ getters: true })),
  });
  // return { answers: answer.map((ans) => ans.toObject({ getters: true })) };
};

const getAllQuestions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }
  let questions;
  //let answerQuestions = [];
  let answers;
  //mergedResults = [];
  //let myAnswers;
  try {
    questions = await Question.find();
    //for (let i = 0; i < questions.length; i++) {
    //console.log("the qustions id are ", questions[i]._id);
    //answers = await Answer.find({ question: questions[i]._id });
    //answers = await getAnswersOfQuestion(questions[i]._id);
    //}
    //console.log(answers);
    //mergedResults = [...Object.values(questions), ...Object.values(answers)];

    //console.log(answers);
    //   const mergedItem = { ...questions[i], ...answers };
    //   answerQuestions.push(mergedItem);
    // }

    // for (const item of questions) {
    //   const itemId = item._id; // Assuming `_id` is the property containing the ID
    //   try {
    //     // Perform the lookup in another table using `itemId`
    //     const lookupResult = await Answer.findOne({
    //       question: itemId,
    //     });
    //     console.log(item);
    //     // Merge the lookup result with the original item
    //     const mergedItem = { ...item, ...lookupResult };

    //     // Add the merged item to the array
    //     mergedResults.push(mergedItem);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("fetching questions failed please try again later ", 500)
    );
  }
  console.log(questions);
  res.json({
    questions,
  });
};

//6460fccd43a6353cf47e722b

exports.addQuestion = addQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
exports.getSingleQuestion = getSingleQuestion;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionsOfCreator = getQuestionsOfCreator;
exports.getAnswersOfQuestion = getAnswersOfQuestion;
//exports.getAnswersOfQuestion = getAnswersOfQuestion;

const pool = require("../Database/db");
const examDefinitionController = require("../Controllers/examDefinitionController");
const jwt = require("jsonwebtoken");

const getAllExamInstance = async (req, res, next) => {
  try {
    const allExamInstance = await pool.query("SELECT * FROM examinstance");
    res.json(allExamInstance.rows);
  } catch (error) {}
};

const addExamInstance = async (req, res, next) => {
  const {
    examdefinition_id,
    startedtime,
    endtime,
    completionTime,
    createdby,
    takenby_ids,
    status,
    questions,
    generated_link,
  } = req.body;

  try {
    const User_Type = req.user.User_Type;

    if (User_Type === "TEACHER") {
      // Check if takenby_ids and examDefinition_id already exist
      const existingExamInstance = await pool.query(
        `SELECT * FROM examinstance WHERE takenby_ids = $1 AND examdefinition_id = $2`,
        [takenby_ids, examdefinition_id]
      );

      if (existingExamInstance.rows.length > 0) {
        console.log("Exam already assigned to this user");
        return res.json({ message: "Exam already assigned to this user" });
      } else {
        const insertExamInstance = await pool.query(
          `INSERT INTO examinstance (examdefinition_id, startedtime, endtime, completionTime, createdby, takenby_ids, status, questions, generated_link)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [
            examdefinition_id,
            startedtime,
            endtime,
            completionTime,
            createdby,
            takenby_ids,
            status,
            questions,
            generated_link,
          ]
        );
        return res.json(insertExamInstance.rows[0]);
      }
    } else {
      return res.json({
        message: "ONLY User type 'TEACHER' is allowed to add an exam instance.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error occurred" });
  }
};

const deleteExamInstance = async (req, res, next) => {
  try {
    const { dei } = req.params;
    const currentUserID = req.user.id;
    const examInstance = await pool.query(
      "SELECT * FROM examinstance WHERE examinstance_id = $1",
      [dei]
    );

    if (examInstance.rowCount === 0) {
      return res.status(404).json({ message: "Exam Instance Not Found" });
    }

    const createdById = examInstance.rows[0].createdby;

    if (req.user.User_Type !== "TEACHER" || createdById !== currentUserID) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deleteExamInstance = await pool.query(
      "DELETE FROM examinstance WHERE examinstance_id = $1",
      [dei]
    );

    if (deleteExamInstance.rowCount > 0) {
      return res.json({ message: "Exam Instance Deleted Successfully" });
    } else {
      return res.status(404).json({ message: "Exam Instance Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSingleExamDefinition = async (examDefinitionId) => {
  try {
    const allExamQuestions = await pool.query(
      "SELECT * FROM examDefinition WHERE examdefinition_id=$1",
      [examDefinitionId]
    );
    const examDefinitionName = allExamQuestions.rows[0].examdefinition_name;
    const passing_score = allExamQuestions.rows[0].passing_score;
    return { examDefinitionName, passing_score };
  } catch (error) {
    console.error("Error retrieving single exam definition:", error);
    throw error;
  }
};

const getUserExamIntsance = async (req, res, next) => {
  const userId = req.params.userId;
  const examInstanceId = req.params.examInsatnceId;
  const examdefId = req.params.examdefId;
  try {
    const examdefinitionId = await pool.query(
      "SELECT * FROM examInstance WHERE takenby_ids=$1 OR createdby=$1",
      [userId]
    );
    if (examdefinitionId.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No generated links found for the user" });
    }
    const examDefinitionIds = examdefinitionId.rows.map(
      (row) => row.examdefinition_id
    );

    let examDefinitionName = "";
    let passing_score = 0;
    for (const examDefinitionId of examDefinitionIds) {
      const { examDefinitionName: name, passing_score: score } =
        await getSingleExamDefinition(examDefinitionId);
      examDefinitionName = name;
      passing_score = score;
    }
    res.json({
      examDefinitionName,
      passing_score,
      examInsatnceId: examdefinitionId.rows,
    });
  } catch (error) {
    console.log("Error retrieving generated links:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getAllUserExamInstance = async (req, res, next) => {
  const userId = req.params.userId;
  const examInstanceId = req.params.examInstanceId;
  try {
    const examdefinitionId = await pool.query(
      "SELECT * FROM examinstance WHERE takenby_ids =$1 AND examinstance_id=$2",
      [userId, examInstanceId]
    );
    if (examdefinitionId.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No generated links found for the user" });
    }

    const examDefinitionIds = examdefinitionId.rows.map(
      (row) => row.examdefinition_id
    );

    let examDefinitionName = "";
    let passing_score = 0;
    for (const examDefinitionId of examDefinitionIds) {
      const { examDefinitionName: name, passing_score: score } =
        await getSingleExamDefinition(examDefinitionId);
      examDefinitionName = name;
      passing_score = score;
    }
    return {
      examDefinitionName,
      passing_score,
      examInsatnceId: examdefinitionId.rows,
    };
  } catch (error) {
    console.error("Error retrieving generated links:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const updateExamInstance = async (req, res, next) => {
  const { questions, studentscore, studentgrade, status, completiontime } =
    req.body;
  const userId = req.params.userId;
  const examInstanceId = req.params.examInstId;
  let updatedExamInstance;
  try {
    const currentExamInstance = await pool.query(
      `SELECT * FROM examInstance WHERE examinstance_id = $1 AND takenby_ids = $2`,
      [examInstanceId, userId]
    );

    if (currentExamInstance.rows.length === 0) {
      console.log("error");
      return res.status(404).json({ error: "Exam instance not found" });
    }

    const updatedQuestions = currentExamInstance.rows[0].questions.map(
      (question) => {
        const updatedQuestion = questions.find(
          (q) =>
            q &&
            q.questionId &&
            question &&
            question.questionId === q.questionId
        );
        return updatedQuestion
          ? {
              ...question,
              selectedAnswerID: updatedQuestion.selectedAnswerID,
              answerTime: updatedQuestion.answerTime,
            }
          : question;
      }
    );
    if (questions.length === 0) {
      console.log("No questions found.");
    }

    updatedExamInstance = await pool.query(
      `UPDATE examInstance
       SET studentscore = $1,
           studentgrade = $2,
           questions = $3,
           status = $4,
           completiontime = $5
       WHERE examinstance_id = $6 AND takenby_ids = $7
       RETURNING *`,
      [
        studentscore,
        studentgrade || currentExamInstance.rows[0].studentgrade,
        updatedQuestions || currentExamInstance.rows[0].questions,
        status || currentExamInstance.rows[0].status,
        completiontime || currentExamInstance.rows[0].completiontime,
        examInstanceId,
        userId,
      ]
    );
    console.log("the updatedQuestion Asnwrr tiem", updatedQuestions);
    res.json({
      message: "Exam instance updated successfully",
      updatedExamInstance: updatedExamInstance.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getSingleExamInstance = async (req, res, next) => {
  const examInsatnceId = req.params.examInsatnceId;
  try {
    const getExamInsatnce = await pool.query(
      "SELECT * FROM examinstance WHERE examinstance_id=$1",
      [examInsatnceId]
    );
    if (getExamInsatnce.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No generated links found for the user" });
    }
    res.json(getExamInsatnce.rows[0]);
  } catch (error) {}
};

exports.getAllExamInstance = getAllExamInstance;
exports.addExamInstance = addExamInstance;
exports.deleteExamInstance = deleteExamInstance;
exports.getUserExamIntsance = getUserExamIntsance;
exports.getAllUserExamInstance = getAllUserExamInstance;
exports.updateExamInstance = updateExamInstance;
exports.getSingleExamInstance = getSingleExamInstance;
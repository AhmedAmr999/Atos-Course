const pool = require("../Database/db");
const examDefinitionController = require("../Controllers/examDefinitionController");
const getAllExamInstance = async (req, res, next) => {
  try {
    const allExamInstance = await pool.query("SELECT * FROM examinstance");
    res.json(allExamInstance.rows);
  } catch (error) {}
};

const addExamInstance = async (req, res, next) => {
  const {
    examDefinition_id,
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
    const insertExamInstance = await pool.query(
      `  INSERT INTO examinstance (examDefinition_id,startedtime, endtime, completionTime, createdby, takenby_ids, status, questions,generated_link)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
      [
        examDefinition_id,
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
    res.json(insertExamInstance.rows[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occurred" });
  }
};

const deleteExamInstance = async (req, res, next) => {
  try {
    const { dei } = req.params;
    const deleteExamInstance = await pool.query(
      "DELETE FROM examinstance WHERE examinstance_id = $1",
      [dei]
    );

    if (deleteExamInstance.rowCount > 0) {
      res.json({ message: "Exam Instance Deleted Successfully" });
    } else {
      res.status(404).json({ message: "Exam Instance Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
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
      "SELECT * FROM examInstance WHERE takenby_ids=$1",
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
           completionTime = $5
       WHERE examinstance_id = $6 AND takenby_ids = $7
       RETURNING *`,
      [
        studentscore,
        studentgrade || currentExamInstance.rows[0].studentgrade,
        updatedQuestions || currentExamInstance.rows[0].questions,
        status || currentExamInstance.rows[0].status,
        completiontime || currentExamInstance.rows[0].completionTime,
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

exports.getAllExamInstance = getAllExamInstance;
exports.addExamInstance = addExamInstance;
exports.deleteExamInstance = deleteExamInstance;
exports.getUserExamIntsance = getUserExamIntsance;
exports.getAllUserExamInstance = getAllUserExamInstance;
exports.updateExamInstance = updateExamInstance;

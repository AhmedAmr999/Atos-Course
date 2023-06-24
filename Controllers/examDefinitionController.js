const pool = require("../Database/db");

const getAllExamDefinition = async (req, res, next) => {
  try {
    const allExamQuestions = await pool.query("SELECT * FROM examDefinition");
    res.json(allExamQuestions.rows);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occurred" });
  }
};

const deleteExamDefinition = async (req, res, next) => {
  try {
    const { edid } = req.params;
    const deleteExam = await pool.query(
      "DELETE FROM examDefinition WHERE examdefinition_id =$1",
      [edid]
    );
    res.json({ message: "Exam Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occurred" });
  }
};

const addExamDefinition = async (req, res, next) => {
  try {
    const { examdefinition_name, passing_score, questions_ids } = req.body;

    const insertExamDefinition = await pool.query(
      `
      INSERT INTO examDefinition (examdefinition_name, passing_score, questions_ids)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [examdefinition_name, passing_score, questions_ids]
    );

    res.json(insertExamDefinition.rows[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occurred" });
  }
};

exports.getAllExamDefinition = getAllExamDefinition;
exports.deleteExamDefinition = deleteExamDefinition;
exports.addExamDefinition = addExamDefinition;

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const answersSchema = new Schema({
  answers: [{ type: String, required: true }],
  correctAnswers: [{ type: String, required: true }],
  question: { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
});


module.exports = mongoose.model("Answer", answersSchema);

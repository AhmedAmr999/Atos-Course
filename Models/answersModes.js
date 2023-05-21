const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const answersSchema = new Schema({
  answers: [{ type: String, required: true }],
  correctAnswers: [{ type: String, required: true }],
  question: { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
});

const db1 = mongoose.createConnection(
  "mongodb+srv://ahmedmaso:ahmed1234@questionscluster.zooyb59.mongodb.net/questions?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = db1.model("Answer", answersSchema);

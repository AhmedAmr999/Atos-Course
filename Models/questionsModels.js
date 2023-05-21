const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const questionsSchema = new Schema(
  {
    questionName: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    mark: { type: Number, required: true },
    expectedTime: { type: String, required: true },
    answersId: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Answer",
    },
    creatorId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const db1 = mongoose.createConnection(
  "mongodb+srv://ahmedmaso:ahmed1234@questionscluster.zooyb59.mongodb.net/questions?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = db1.model("Question", questionsSchema);

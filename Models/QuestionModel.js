const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const questionsSchema = new Schema(
  {
    questionName: { type: String, required: true, unique: true },
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

questionsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Question", questionsSchema);

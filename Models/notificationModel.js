const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationsSchema = new Schema(
  {
    examDefinitionName: { type: String, required: true },
    examdefinition_id: { type: String, required: true },
    examinstance_id: { type: String, required: true },
    generated_link: { type: String, required: true },
    studentId: { type: String, required: true },
    creatorId: { type: String, required: true },
    startedtime: { type: Date, required: true },
    testTaken: {
      type: String,
      enum: ["taken", "non-taken"],
      default: "non-taken",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationsSchema);

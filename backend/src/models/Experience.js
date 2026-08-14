const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Education", "Training", "Freelance", "Job", "Project"],
      required: true,
    },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    location: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);

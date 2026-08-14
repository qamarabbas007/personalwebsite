const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "" },
    percentage: { type: Number, min: 0, max: 100, default: 80 },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "Tools", "Other"],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);

const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    notes: { type: String, default: "" },
    projectsRequested: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);

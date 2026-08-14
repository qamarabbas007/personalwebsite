const mongoose = require("mongoose");

// Stores the AI-assistant conversation separately from the human ChatMessage
// collection. Keyed by sessionId so anonymous visitors (not logged in) can
// still have a continuous conversation in the browser.
const aiChatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, set if logged in
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiChatMessage", aiChatMessageSchema);

const asyncHandler = require("express-async-handler");
const AiChatMessage = require("../models/AiChatMessage");
const { askAssistant } = require("../services/aiChatService");

// @desc  Send a message to the AI assistant and get a reply (public, no login required)
// @route POST /api/ai-chat
// body: { sessionId, message }
const sendAiMessage = asyncHandler(async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message?.trim()) {
    res.status(400);
    throw new Error("sessionId and message are required");
  }

  // Save the visitor's message
  await AiChatMessage.create({
    sessionId,
    user: req.user?._id,
    role: "user",
    text: message.trim(),
  });

  // Pull recent history for context (last 12 messages)
  const history = await AiChatMessage.find({ sessionId })
    .sort("-createdAt")
    .limit(12)
    .then((docs) => docs.reverse().slice(0, -1)); // drop the message we just saved, it's passed separately

  const replyText = await askAssistant(history, message.trim());

  const reply = await AiChatMessage.create({
    sessionId,
    user: req.user?._id,
    role: "assistant",
    text: replyText,
  });

  res.status(201).json({ success: true, data: reply });
});

// @desc  Get AI chat history for a session
// @route GET /api/ai-chat/:sessionId
const getAiHistory = asyncHandler(async (req, res) => {
  const messages = await AiChatMessage.find({ sessionId: req.params.sessionId }).sort("createdAt");
  res.json({ success: true, data: messages });
});

module.exports = { sendAiMessage, getAiHistory };

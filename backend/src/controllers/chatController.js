const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const ChatMessage = require("../models/ChatMessage");
const { getOrCreateConversation } = require("../services/chatService");

// @desc  Admin: list all conversations, most recently active first
// @route GET /api/chat/conversations
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find()
    .populate("client", "name email isOnline lastSeen avatar")
    .sort("-lastMessageAt");
  res.json({ success: true, data: conversations });
});

// @desc  Get (or lazily create) the logged-in client's own conversation
// @route GET /api/chat/mine
const getMyConversation = asyncHandler(async (req, res) => {
  const conversation = await getOrCreateConversation(req.user._id);
  res.json({ success: true, data: conversation });
});

// @desc  Get all messages for one conversation
// @route GET /api/chat/:conversationId
const getConversationMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const isOwner = conversation.client.toString() === req.user._id.toString();
  if (req.user.role !== "admin" && !isOwner) {
    res.status(403);
    throw new Error("Not authorized to view this conversation");
  }

  const messages = await ChatMessage.find({ conversation: req.params.conversationId })
    .populate("sender", "name role avatar")
    .sort("createdAt");

  res.json({ success: true, data: { conversation, messages } });
});

// @desc  Mark all messages in a conversation as read by the current user
// @route PUT /api/chat/message/:id/read
const markMessageRead = asyncHandler(async (req, res) => {
  const message = await ChatMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: message });
});

// @desc  Admin: close/delete a conversation
// @route DELETE /api/chat/:conversationId
const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByIdAndDelete(req.params.conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }
  await ChatMessage.deleteMany({ conversation: req.params.conversationId });
  res.json({ success: true, data: {} });
});

module.exports = {
  getConversations,
  getMyConversation,
  getConversationMessages,
  markMessageRead,
  deleteConversation,
};

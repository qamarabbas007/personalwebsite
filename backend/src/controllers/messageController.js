const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const { notifyAdminNewMessage, sendClientConfirmation } = require("../services/emailService");
const { notifyAdmin } = require("../services/notificationService");
const ApiFeatures = require("../utils/apiFeatures");

// @desc  Public contact / project request form submission
// @route POST /api/messages
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, projectType, budget, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email and message are required");
  }

  const doc = await Message.create({ name, email, subject, projectType, budget, message });

  notifyAdmin("notification:newMessage", { id: doc._id, name: doc.name });
  await notifyAdminNewMessage(doc);
  await sendClientConfirmation(doc);

  res.status(201).json({ success: true, data: doc });
});

// @desc  Admin: list messages (search/filter/paginate)
// @route GET /api/messages
const getMessages = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Message.find(), req.query)
    .search(["name", "email", "message"])
    .filter(["status"])
    .sort();

  const total = await Message.countDocuments(features.query.getFilter());
  features.paginate();
  const messages = await features.query;

  res.json({ success: true, count: messages.length, total, data: messages });
});

const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: message });
});

const updateMessageStatus = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: message });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: {} });
});

module.exports = { createMessage, getMessages, getMessage, updateMessageStatus, deleteMessage };

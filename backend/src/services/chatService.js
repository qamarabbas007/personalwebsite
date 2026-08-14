const Conversation = require("../models/Conversation");
const ChatMessage = require("../models/ChatMessage");

const getOrCreateConversation = async (clientId) => {
  let conversation = await Conversation.findOne({ client: clientId });
  if (!conversation) {
    conversation = await Conversation.create({ client: clientId });
  }
  return conversation;
};

const saveMessage = async ({ conversationId, senderId, text }) => {
  const chatMessage = await ChatMessage.create({
    conversation: conversationId,
    sender: senderId,
    text,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: text,
    lastMessageAt: new Date(),
  });

  return chatMessage;
};

module.exports = { getOrCreateConversation, saveMessage };

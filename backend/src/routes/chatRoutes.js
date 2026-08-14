const express = require("express");
const {
  getConversations,
  getMyConversation,
  getConversationMessages,
  markMessageRead,
  deleteConversation,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/conversations", protect, isAdmin, getConversations); // admin inbox list
router.get("/mine", protect, getMyConversation); // client's own thread
router.get("/:conversationId", protect, getConversationMessages);
router.put("/message/:id/read", protect, markMessageRead);
router.delete("/:conversationId", protect, isAdmin, deleteConversation);

module.exports = router;

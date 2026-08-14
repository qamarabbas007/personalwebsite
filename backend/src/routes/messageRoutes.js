const express = require("express");
const {
  createMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", createMessage); // public contact form
router.get("/", protect, isAdmin, getMessages);
router.get("/:id", protect, isAdmin, getMessage);
router.put("/:id/status", protect, isAdmin, updateMessageStatus);
router.delete("/:id", protect, isAdmin, deleteMessage);

module.exports = router;

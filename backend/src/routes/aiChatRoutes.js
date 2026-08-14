const express = require("express");
const { sendAiMessage, getAiHistory } = require("../controllers/aiChatController");

const router = express.Router();

// Public — visitors don't need to be logged in to talk to the AI assistant
router.post("/", sendAiMessage);
router.get("/:sessionId", getAiHistory);

module.exports = router;

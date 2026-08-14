const express = require("express");
const { getClients, getClient, updateClient, deleteClient } = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, isAdmin, getClients);
router.get("/:id", protect, isAdmin, getClient);
router.put("/:id", protect, isAdmin, updateClient);
router.delete("/:id", protect, isAdmin, deleteClient);

module.exports = router;

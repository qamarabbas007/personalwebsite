const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Admin-only: used by the admin dashboard's image/resume upload fields
router.post("/", protect, isAdmin, upload.single("file"), uploadFile);

module.exports = router;

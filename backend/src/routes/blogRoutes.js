const express = require("express");
const controller = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id", controller.getOne);
router.post("/", protect, isAdmin, controller.create);
router.put("/:id", protect, isAdmin, controller.update);
router.delete("/:id", protect, isAdmin, controller.remove);

module.exports = router;

const Project = require("../models/Project");
const createCrudController = require("./crudFactory");
const { slugify } = require("../utils/validators");
const asyncHandler = require("express-async-handler");

const base = createCrudController(Project, {
  searchFields: ["title", "description", "technologies"],
  filterFields: ["category", "featured", "status"],
});

module.exports = {
  ...base,
  create: asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    if (!payload.slug) payload.slug = slugify(payload.title);
    const project = await Project.create(payload);
    res.status(201).json({ success: true, data: project });
  }),
  getBySlug: asyncHandler(async (req, res) => {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json({ success: true, data: project });
  }),
};

const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");

/**
 * Generic CRUD controller factory used by the simpler resources
 * (Skill, Service, Experience, Testimonial, Blog, Project).
 * Keeps each real controller file thin while still giving every
 * resource its own dedicated route + controller module.
 */
const createCrudController = (Model, { searchFields = [], filterFields = [] } = {}) => ({
  getAll: asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Model.find(), req.query)
      .search(searchFields)
      .filter(filterFields)
      .sort();

    const total = await Model.countDocuments(features.query.getFilter());
    features.paginate();
    const items = await features.query;

    res.json({ success: true, count: items.length, total, data: items });
  }),

  getOne: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ success: true, data: item });
  }),

  create: asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  }),

  update: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ success: true, data: item });
  }),

  remove: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ success: true, data: {} });
  }),
});

module.exports = createCrudController;

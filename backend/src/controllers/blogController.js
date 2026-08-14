const Blog = require("../models/Blog");
const createCrudController = require("./crudFactory");
const { slugify } = require("../utils/validators");
const asyncHandler = require("express-async-handler");

const base = createCrudController(Blog, {
  searchFields: ["title", "excerpt", "content", "tags"],
  filterFields: ["category", "featured", "published"],
});

// Blog needs a couple of overrides: slug generation + view counter + slug lookup
module.exports = {
  ...base,
  create: asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    if (!payload.slug) payload.slug = slugify(payload.title);
    const blog = await Blog.create(payload);
    res.status(201).json({ success: true, data: blog });
  }),
  getBySlug: asyncHandler(async (req, res) => {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) {
      res.status(404);
      throw new Error("Blog post not found");
    }
    res.json({ success: true, data: blog });
  }),
};

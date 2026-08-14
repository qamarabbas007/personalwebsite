const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, default: "General" },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    author: { type: String, default: "Qamar Abbas" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

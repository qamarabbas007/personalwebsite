const asyncHandler = require("express-async-handler");

// @desc  Upload a single image/PDF file, return its public URL
// @route POST /api/upload
// Field name: "file" (multipart/form-data)
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file was uploaded");
  }

  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, data: { url, filename: req.file.filename } });
});

module.exports = { uploadFile };

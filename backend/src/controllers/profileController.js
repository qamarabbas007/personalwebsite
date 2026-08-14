const asyncHandler = require("express-async-handler");
const Profile = require("../models/Profile");

// Single-document "settings" style resource — always returns/updates the one profile

const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  res.json({ success: true, data: profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create(req.body);
  } else {
    profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  res.json({ success: true, data: profile });
});

module.exports = { getProfile, updateProfile };

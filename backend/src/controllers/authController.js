const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Client = require("../models/Client");
const generateToken = require("../utils/generateToken");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { isEmail } = require("../utils/validators");

// @desc  Register a new client account
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || !isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid name, email and password");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed, role: "client" });
  await Client.create({ user: user._id });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    },
  });
});

// @desc  Login (client or admin — role is read from the stored user)
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await comparePassword(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id, user.role),
    },
  });
});

// @desc  Get logged-in user's profile
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc  Logout (client-side just discards the token; this clears online status)
// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.isOnline = false;
    req.user.lastSeen = new Date();
    await req.user.save();
  }
  res.json({ success: true, message: "Logged out" });
});

module.exports = { register, login, getMe, logout };

const asyncHandler = require("express-async-handler");
const Client = require("../models/Client");
const ApiFeatures = require("../utils/apiFeatures");

const getClients = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Client.find().populate("user", "name email isOnline lastSeen"), req.query)
    .sort();
  const total = await Client.countDocuments();
  features.paginate();
  const clients = await features.query;
  res.json({ success: true, count: clients.length, total, data: clients });
});

const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).populate("user", "name email isOnline lastSeen");
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  res.json({ success: true, data: client });
});

const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  res.json({ success: true, data: client });
});

const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  res.json({ success: true, data: {} });
});

module.exports = { getClients, getClient, updateClient, deleteClient };

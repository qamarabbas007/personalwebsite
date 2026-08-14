// In-memory pub/sub bridged to Socket.IO for admin notification badges.
// For production, back this with a Notifications collection.
let ioInstance = null;

const initNotificationService = (io) => {
  ioInstance = io;
};

const notifyAdmin = (event, payload) => {
  if (!ioInstance) return;
  ioInstance.to("admin-room").emit(event, payload);
};

module.exports = { initNotificationService, notifyAdmin };

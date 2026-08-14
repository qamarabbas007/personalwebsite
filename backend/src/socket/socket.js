const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const User = require("../models/User");
const { getOrCreateConversation, saveMessage } = require("../services/chatService");
const Conversation = require("../models/Conversation");
const { initNotificationService } = require("../services/notificationService");

const onlineUsers = new Map(); // userId -> socketId

const initSocket = (io) => {
  initNotificationService(io);

  // Authenticate socket connections using the same JWT used for REST
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(); // allow anonymous visitors for public widget preview
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) socket.user = user;
      next();
    } catch (err) {
      next(); // fail open to anonymous; protected actions still require auth checks below
    }
  });

  io.on("connection", (socket) => {
    if (socket.user) {
      onlineUsers.set(socket.user._id.toString(), socket.id);
      if (socket.user.role === "admin") {
        socket.join("admin-room");
      }
      io.emit("presence:update", { userId: socket.user._id, online: true });
    }

    // Client or admin joins a specific conversation room
    socket.on("chat:join", async ({ conversationId }) => {
      if (conversationId) socket.join(`conversation:${conversationId}`);
    });

    // Client starts / resumes their conversation
    socket.on("chat:start", async () => {
      if (!socket.user) return;
      const conversation = await getOrCreateConversation(socket.user._id);
      socket.join(`conversation:${conversation._id}`);
      socket.emit("chat:started", { conversation });
    });

    // Send a message (from client or admin)
    socket.on("chat:message", async ({ conversationId, text }) => {
      if (!socket.user || !text?.trim()) return;

      const message = await saveMessage({
        conversationId,
        senderId: socket.user._id,
        text: text.trim(),
      });

      const isAdmin = socket.user.role === "admin";
      await Conversation.findByIdAndUpdate(conversationId, {
        $inc: isAdmin ? { unreadByClient: 1 } : { unreadByAdmin: 1 },
      });

      io.to(`conversation:${conversationId}`).emit("chat:message", message);

      if (!isAdmin) {
        io.to("admin-room").emit("chat:newMessage", { conversationId, message });
      }
    });

    socket.on("chat:typing", ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit("chat:typing", {
        userId: socket.user?._id,
        isTyping,
      });
    });

    socket.on("chat:read", async ({ conversationId }) => {
      if (!socket.user) return;
      const isAdmin = socket.user.role === "admin";
      await Conversation.findByIdAndUpdate(conversationId, {
        [isAdmin ? "unreadByAdmin" : "unreadByClient"]: 0,
      });
      io.to(`conversation:${conversationId}`).emit("chat:readReceipt", {
        conversationId,
        by: socket.user._id,
      });
    });

    socket.on("disconnect", () => {
      if (socket.user) {
        onlineUsers.delete(socket.user._id.toString());
        io.emit("presence:update", { userId: socket.user._id, online: false });
      }
    });
  });
};

module.exports = { initSocket, onlineUsers };

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket/socket");
const { PORT, CLIENT_URL } = require("./config/env");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});

initSocket(io);

// Make io accessible to controllers/routes if ever needed (e.g. req.app.get("io"))
app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

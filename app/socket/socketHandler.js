const socketIO = require("socket.io");
const formatMessages = require("../utils/messages");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {userJoin} = require("../utils/user")

const JWT_SECRET_KEY = process.env.MY_CUSTOM_SECRET_KEY;

const initializeSocket = (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    socket.on("joinRoom", (token) => {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const { username, room } = decoded;

        const user = userJoin(socket.id, username, room);
        socket.join(user.room)
        socket.emit("message", formatMessages("BOT", `Welcome ${user.username}!`));
        socket.broadcast.emit(
            "message",
            formatMessages("BOT", `${user.username}just connected!`)
        );

        socket.on("chatMsg", (m) => {
            io.emit("message", formatMessages(user.username, m));
          });
      
          socket.on("disconnect", () => {
            io.emit("message", formatMessages("BOT", `${user.username} has just left!`));
          });
    });
  });
};
module.exports = initializeSocket;

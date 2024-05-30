import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import router from "./routes/index.js";

const API_PORT = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(router);
const allUsers = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: allUsers[socketId],
      };
    }
  );
};
io.on("connection", (socket) => {
  socket.on("join", ({ roomId, username }) => {
    if (allUsers[socket.id]) {
      return;
    }
    allUsers[socket.id] = username;
    console.log("join: ", username);
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("message", ({ roomId, message, username }) => {
    console.log(`message from ${username} in room ${roomId}: `, message);
    io.to(roomId).emit("message", { message, username });
  });

  socket.on("code-change", ({ roomId, code }) => {
    console.log("code-change: ", code);
    socket.in(roomId).emit("code-change", { code });
  });

  socket.on("language-change", ({ roomId, language }) => {
    console.log("language-change: ", language);
    socket.in(roomId).emit("language-change", { language });
  });

  socket.on("sync-code", ({ socketId, code, language }) => {
    console.log("sync: ", code, language);
    io.to(socketId).emit("code-change", { code });
    io.to(socketId).emit("language-change", { language });
  });
  socket.on("leave-room", ({ roomId, username }) => {
    // Emit the 'disconnected' event to other clients in the room
    socket.in(roomId).emit("disconnected", {
      socketId: socket.id,
      username: username,
    });

    // Remove the user from the room
    socket.leave(roomId);

    // Optionally log the event or perform additional clean-up
    console.log(`${username} has left room ${roomId}`);
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: allUsers[socket.id],
      });
    });
    delete allUsers[socket.id];
    console.log(allUsers);
  });

  // socket.on("disconnecting", () => {
  //   const rooms = [...socket.rooms];
  //   rooms.forEach((roomId) => {
  //     socket.in(roomId).emit("disconnected", {
  //       socketId: socket.id,
  //       username: allUsers[socket.id],
  //     });
  //   });
  //   delete allUsers[socket.id];
  // });

  // socket.on("disconnecting", () => {
  //   const rooms = [...socket.rooms];
  //   rooms.forEach((roomId) => {
  //     socket.in(roomId).emit("disconnected", {
  //       socketId: socket.id,
  //       username: allUsers[socket.id],
  //     });
  //   });
  //   delete allUsers[socket.id];
  // });
});

httpServer.listen(API_PORT, () => {
  console.log("Server is running on port", API_PORT);
});

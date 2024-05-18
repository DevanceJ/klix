import express from 'express';
import { Server } from "socket.io";
import { createServer } from "http";
import router from './routes/index.js';

const API_PORT = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const users = {};

app.use(router);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (message) => {
    console.log('message: ', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    delete users[socket.id];
    io.emit('users', users);
  });

  socket.on('set-nick', (nick) => {
    socket.nick = nick;
    users[socket.id] = nick;
    io.emit('users', users);
  });

  socket.on('code-change', (code) => {
    console.log('code-change: ', code);
    // emit to all except sender
    socket.broadcast.emit('code-change', code);
  });
});

httpServer.listen(API_PORT, () => {
  console.log('Server is running on port', API_PORT);
});
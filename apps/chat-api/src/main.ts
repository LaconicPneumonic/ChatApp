/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { Server } from 'socket.io';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to chat-api!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('USER CONNECTED');
  socket.on('message', async (msg) => {
    console.log('RECEIVED MESSAGE');
    io.emit('message', msg);
  });
});

server.on('error', console.error);

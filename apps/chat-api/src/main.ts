/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from 'cors';
import express from 'express';
import * as path from 'path';
import { Server } from 'socket.io';

import { Message, MessageDAO } from './lib/messageDAO';

const client = new MessageDAO();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  })
);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/message/:messageId', async (req, res) => {
  const result = await client.getMessage(req.params.messageId);

  res.send(result);
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

io.on('connection', async (socket) => {
  const newMessages = await client.getMessagesBefore();

  for (const message of newMessages) {
    socket.emit('message', message);
  }

  socket.on('message', async (msg: Record<keyof Message, string>) => {
    const parsedMessage = {
      sendDate: new Date(msg.sendDate),
      userName: msg.userName,
      content: msg.content,
    };

    const messageId = await client.writeMessage(parsedMessage);

    io.emit('message', {
      id: messageId,
      sendDate: parsedMessage.sendDate,
    });
  });
});

server.on('error', console.error);
server.on('close', () => client.close());

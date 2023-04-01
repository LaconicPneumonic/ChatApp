import cors from 'cors';
import express from 'express';
import pino from 'pino';
import pinoExpress from 'pino-http';
import { Server } from 'socket.io';

import { Message, MessageDAO } from './lib/messageDAO';
import { mongoClient } from './middleware';

const app = express();
const logger = pino();
const client = new MessageDAO(logger.info);

const WEBSITE_URL = process.env.WEBSITE_URL || 'http://localhost:4200';

app.use(
  cors({
    origin: WEBSITE_URL,
    methods: ['GET', 'POST'],
  })
);

app.use(pinoExpress());
app.use(mongoClient);

app.get('/message/:messageId', async (req, res) => {
  const result = await req.getMessageDao().getMessage(req.params.messageId);
  res.send(result);
});

app.get('/messages/:date', async (req, res) => {
  const parsedDate = new Date(decodeURI(req.params.date));

  const oldMessages = await client.getMessagesBefore(parsedDate);

  return res.status(200).json(oldMessages);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

const io = new Server(server, {
  cors: {
    origin: WEBSITE_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket) => {
  const newMessages = await client.getMessagesBefore(null, 20);

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

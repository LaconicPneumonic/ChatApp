import { RequestHandler } from 'express';

import { MessageDAO, MessageInterface } from '../lib/messageDAO';

// client management
const mongoClient: RequestHandler = (req, res, next) => {
  let client: MessageInterface | undefined;

  // create the client on request by the api
  const messageFunction = () => {
    if (client == undefined) {
      client = new MessageDAO(req.log.debug);
    }

    return client;
  };

  req.getMessageDao = messageFunction;

  res.on('close', async () => {
    if (client) {
      await client.close();
      client = undefined;
    }
  });

  next();
};

export { mongoClient };

declare module 'http' {
  interface IncomingMessage {
    getMessageDao(): MessageInterface;
  }
}

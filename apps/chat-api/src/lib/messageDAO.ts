import { MongoClient, Collection, ObjectId } from 'mongodb';

const connString =
  process.env.MONGODB_CONNSTRING || 'mongodb://localhost:27017';

export type Message = {
  sendDate: Date;
  content: string;
  userName: string;
};

type MessageId = string;

interface MessageInterface {
  writeMessage(msg: Message): Promise<MessageId>;
  getMessage(id: MessageId): Promise<Message>;
  getMessagesBefore(
    page: Date | undefined,
    num: number
  ): Promise<
    Array<{
      id: MessageId;
      sendDate: Date;
    }>
  >;

  close(): Promise<void>;
}

export class MessageDAO implements MessageInterface {
  messageCollection: Collection<Message>;
  client: MongoClient;
  constructor() {
    this.client = new MongoClient(connString);
    this.messageCollection = this.client
      .db('chat')
      .collection<Message>('messages');
  }
  async writeMessage(msg: Omit<Message, '_id'>): Promise<string> {
    const ret = await this.messageCollection.insertOne(msg);
    return ret.insertedId.toHexString();
  }
  async getMessage(id: string): Promise<Message> {
    const ret = await this.messageCollection.findOne({ _id: new ObjectId(id) });
    return ret;
  }
  async getMessagesBefore(
    page?: Date,
    num = 10
  ): Promise<{ id: string; sendDate: Date }[]> {
    const ret = await this.messageCollection
      .find({
        sendDate: {
          $gt: page != undefined ? page : new Date(0),
        },
      })
      .sort({
        sendDate: -1,
      })
      .limit(num)
      .project({ sendDate: 1 })
      .toArray();

    return ret.map((r) => ({ id: r._id, sendDate: r.sendDate }));
  }

  async close(): Promise<void> {
    return this.client.close();
  }
}

// const run = async (): Promise<void> => {
//   const client = new MessageDAO();

//   try {
//     const messages = Array.from({ length: 100 }).map((_, i) =>
//       client.writeMessage({
//         sentBy: 'me',
//         content: `SENT THIS JAWN AT ${i}`,
//         sendDate: new Date(),
//       })
//     );

//     const ids = await Promise.all(messages);

//     console.log(ids);

//     console.log(await client.getMessagesBefore());
//   } finally {
//     // Ensures that the client will close when you finish/error

//     await client.close();
//   }
// };

// run().catch(console.dir);

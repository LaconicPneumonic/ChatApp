import { MongoClient, Collection, ObjectId } from 'mongodb';

const connString =
  process.env.MONGODB_CONNSTRING || 'mongodb://localhost:27017';

export type Message = {
  sendDate: Date;
  content: string;
  userName: string;
};

type MessageId = string;

export interface MessageInterface {
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
  constructor(logger: (...args: Array<unknown>) => void) {
    this.client = new MongoClient(connString);
    this.messageCollection = this.client
      .db('chat')
      .collection<Message>('messages');

    // add logging statements
    this.client.on('commandStarted', logger);
    this.client.on('commandSucceeded', logger);
    this.client.on('commandFailed', logger);
  }

  async writeMessage(msg: Message): Promise<string> {
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
          $lt: page != undefined ? page : new Date(),
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

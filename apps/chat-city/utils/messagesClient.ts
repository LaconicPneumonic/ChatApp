import { MessageType } from '../components/Message';

const getMessagesBefore = async (
  date: Date,
  SERVER_URL: string
): Promise<Array<{ id: string; sendDate: string }>> => {
  const response = await fetch(
    `${SERVER_URL}/messages/${encodeURI(date.toISOString())}`
  );

  return await response.json();
};

const getMessage = async (
  id: string,
  SERVER_URL: string
): Promise<MessageType> => {
  const rawMsg = localStorage.getItem(id);

  if (rawMsg) {
    return JSON.parse(rawMsg);
  }
  const response = await fetch(`${SERVER_URL}/message/${id}`);

  const ret = await response.json();

  localStorage.setItem(id, JSON.stringify(ret));

  return ret;
};

export { getMessagesBefore, getMessage };

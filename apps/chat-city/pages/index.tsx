import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { UserNameForm } from '../components/UserNameForm';
import { ConnectedIcon } from '../components/ConnectedIcon';
import { MessageBox } from '../components/MessageBox';
import { MessageType, Message } from '../components/Message';

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

export function Index({ SERVER_URL }: { SERVER_URL: string }) {
  const [currentSocket, setCurrentSocket] = useState<Socket>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState<string>(undefined);
  const [messages, setMessages] = useState<Array<MessageType>>([]);

  const [loading, setLoading] = useState(false);
  const [oldestDate, setOldestDate] = useState<Date>(new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop < 10 && !loading) {
        console.log('fetching more messages', oldestDate);
        setLoading(true);

        getMessagesBefore(oldestDate, SERVER_URL).then(async (msgs) => {
          const newMessages = await Promise.all(
            msgs.map(async (msg) => {
              const m = await getMessage(msg.id, SERVER_URL);
              return { id: msg.id, ...m };
            })
          );

          const oldestMessageDate = newMessages
            .map((m) => new Date(m.sendDate))
            .reduce((prev, current) => {
              return prev < current ? prev : current;
            }, new Date());

          setOldestDate(
            oldestMessageDate < oldestDate ? oldestMessageDate : oldestDate
          );

          setMessages((m) =>
            [...newMessages, ...m]
              .filter((v, i, a) => a.findIndex((p) => p.id == v.id) == i)
              .sort((a, b) => a.sendDate.localeCompare(b.sendDate))
          );

          if (newMessages.length > 0) containerRef.current.scrollTo(0, 50);
          setLoading(newMessages.length == 0);
        });
      }
    };

    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [oldestDate]);

  useEffect(() => {
    const socket = io(SERVER_URL);

    setCurrentSocket(socket);

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on(
      'message',
      async (fromServer: { id: string; sendDate: string }) => {
        const msg: MessageType = await getMessage(fromServer.id, SERVER_URL);

        const newDate = new Date(msg.sendDate);
        setOldestDate(newDate < oldestDate ? newDate : oldestDate);

        // inefficient
        setMessages((m) =>
          [...m, { id: fromServer.id, ...msg }]
            .filter((v, i, a) => a.findIndex((p) => p.id == v.id) == i)
            .sort((a, b) => a.sendDate.localeCompare(b.sendDate))
        );
      }
    );

    containerRef.current.scrollTo(0, 500);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendMessage = (msg: string) => {
    const message = {
      userName,
      content: msg,
      sendDate: new Date(),
    };

    currentSocket.emit('message', message);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="h-full w-full flex flex-grow flex-row overflow-hidden">
        <aside className="w-0 flex-shrink bg-cyan-700 sm:w-auto">
          <div className="flex content-start justify-between divide-slate-700 border-solid sm:flex-col sm:divide-y-2">
            <div className="flex fle  x-row gap-3 p-3 font-bold text-white">
              <p className="w-0 whitespace-nowrap sm:w-auto">THEE GROUPCHAT</p>
            </div>
          </div>
        </aside>
        <main
          ref={containerRef}
          className="min-h-full w-full p-4 px-3 overflow-y-scroll bg-cyan-100"
        >
          <div className="grid grid-cols-1 place-content-end gap-2">
            {messages.map((msg, i) => {
              return (
                <Message
                  key={i}
                  mine={msg.userName == userName}
                  message={msg}
                />
              );
            })}
          </div>
        </main>
      </div>
      <footer className="bg-slate-600 flex flex-row p-2 gap-4 place-items-center border-separate">
        <span className="text-white">
          <ConnectedIcon connected={isConnected} />
        </span>
        <div className="h-full">
          <UserNameForm
            userNameSet={userName != null}
            setUserName={setUserName}
          />
        </div>

        {userName != null && (
          <div className="h-full flex-grow">
            <MessageBox sendMessage={sendMessage} />
          </div>
        )}
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const SERVER_URL = process.env.SERVER_URL;

  return {
    props: {
      SERVER_URL,
    },
  };
}

export default Index;

import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { UserNameForm } from '../components/UserNameForm';
import { ConnectedIcon } from '../components/ConnectedIcon';
import { MessageBox } from '../components/MessageBox';
import { MessageType, Message } from '../components/Message';

export function Index({ SERVER_URL }: { SERVER_URL: string }) {
  const [currentSocket, setCurrentSocket] = useState<Socket>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState<string>(undefined);

  const [messages, setMessages] = useState<Array<MessageType>>([]);

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
        const response = await fetch(`${SERVER_URL}/message/${fromServer.id}`);

        const msg: MessageType = await response.json();

        // inefficient
        setMessages((m) =>
          [...m, { id: fromServer.id, ...msg }]
            .filter((v, i, a) => a.findIndex((p) => p.id == v.id) == i)
            .sort((a, b) => a.sendDate.localeCompare(b.sendDate))
        );
      }
    );

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
    <div className="min-h-screen w-screen flex flex-col">
      <div className="h-full w-full flex flex-grow flex-row overflow-hidden">
        <aside className="w-0 flex-shrink bg-cyan-700 sm:w-auto">
          <div className="flex content-start justify-between divide-slate-700 border-solid sm:flex-col sm:divide-y-2">
            <div className="flex flex-row gap-3 p-3 font-bold text-white">
              <p className="w-0 whitespace-nowrap sm:w-auto">THEE GROUPCHAT</p>
            </div>
          </div>
        </aside>
        <main className="min-h-full w-full p-4 px-3 overflow-auto bg-cyan-100">
          <div className="h-full grid grid-cols-1 place-content-end gap-2">
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

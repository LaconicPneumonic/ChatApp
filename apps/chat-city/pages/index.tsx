import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { UserNameForm } from '../components/UserNameForm';
import { ConnectedIcon, MessageBox } from '../components/ConnectedIcon';
import { MessageType, Message } from '../components/Message';

export function Index() {
  const [currentSocket, setCurrentSocket] = useState<Socket>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState<string>(undefined);

  const [messages, setMessages] = useState<Array<MessageType>>([]);

  useEffect(() => {
    const socket = io('http://localhost:3333/');

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
        const response = await fetch(
          `http://localhost:3333/message/${fromServer.id}`
        );

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
    <div className="h-screen w-screen flex flex-col">
      <div className="h-full w-full flex flex-grow flex-row overflow-hidden">
        <aside className="w-0 flex-shrink bg-cyan-700 sm:w-auto">
          <div className="flex content-start justify-between divide-slate-700 border-solid sm:flex-col sm:divide-y-2">
            <div className="flex flex-row gap-3 p-3 font-bold text-white">
              <p className="w-0 whitespace-nowrap sm:w-auto">THEE GROUPCHAT</p>
            </div>
          </div>
        </aside>
        <main className="h-full w-full p-4 px-3 overflow-auto bg-cyan-100">
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
      <footer className="mt-auto bg-slate-600 flex flex-row p-2 gap-4 place-items-center border-separate">
        <span className="text-white">
          <ConnectedIcon connected={isConnected} />
        </span>
        <span>
          <UserNameForm
            userNameSet={userName != null}
            setUserName={setUserName}
          />
        </span>

        <span className="flex-grow">
          <MessageBox disabled={userName == null} sendMessage={sendMessage} />
        </span>
      </footer>
    </div>
  );
}

export default Index;

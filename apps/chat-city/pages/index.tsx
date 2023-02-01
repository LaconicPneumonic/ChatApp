import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { UserNameForm } from '../components/UserNameForm';
import { ConnectedIcon, MessageBox } from '../components/ConnectedIcon';
import { MessageType, Message } from '../components/Message';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

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

    socket.on('message', (fromServer) => {
      setMessages((m) => [...m, fromServer]);
    });

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
    };

    currentSocket.emit('message', message);
  };

  return (
    <div className="flex min-h-screen w-auto flex-col">
      <div className="h-100 flex w-full flex-grow flex-row overflow-hidden">
        <aside className="w-0 flex-shrink bg-cyan-700 sm:w-auto">
          <div className="flex content-start justify-between divide-slate-700 overflow-hidden border-solid sm:flex-col sm:divide-y-2">
            <div className="flex flex-row gap-3 p-2 font-bold text-white">
              <svg
                className="h-6 w-6 flex-none fill-slate-600 stroke-2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="11" />
              </svg>

              <p className="w-0 whitespace-nowrap sm:w-auto">Ye Old Chat</p>
            </div>
            <div className="flex flex-row gap-3 p-2 font-bold text-white">
              <svg
                className="h-6 w-6 flex-none fill-slate-600 stroke-2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="11" />
              </svg>

              <p className="w-0 whitespace-nowrap sm:w-auto">Yonatan</p>
            </div>
            <div className="flex flex-row gap-3 p-2 text-white">
              <svg
                className="h-6 w-6 flex-none fill-slate-600 stroke-2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="11" />
              </svg>

              <p className="w-0 whitespace-nowrap sm:w-auto">Jake</p>
            </div>
            <div className="flex flex-row gap-3 p-2 text-white">
              <svg
                className="h-6 w-6 flex-none fill-slate-600 stroke-2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="11" />
              </svg>

              <p className="w-0 whitespace-nowrap sm:w-auto">John Smith</p>
            </div>
          </div>
        </aside>
        <main
          role="main"
          className="grid  grid-cols-1 place-content-end gap-2 overflow-y-scroll bg-cyan-100 p-4 px-3 flex-grow"
        >
          {messages.map((msg, i) => {
            return (
              <Message key={i} mine={msg.userName == userName} message={msg} />
            );
          })}
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
          <MessageBox
            disabled={userName == undefined}
            sendMessage={sendMessage}
          />
        </span>
      </footer>
    </div>
  );
}

export default Index;
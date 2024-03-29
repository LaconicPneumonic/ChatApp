import { useState } from 'react';

type Props = {
  sendMessage: (msg: string) => void;
};
export const MessageBox = ({ sendMessage }: Props) => {
  const [msg, setMsg] = useState<string>(null);

  const formHandler = (e) => {
    sendMessage(msg);
    setMsg(null);
    e.preventDefault();
  };

  return (
    <form
      onSubmit={formHandler}
      className="h-full flex flex-row items-center gap-2"
    >
      <input
        className="h-full text-black flex-grow rounded-md p-2"
        type="text"
        value={msg || ''}
        onChange={(e) => setMsg(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-0 sm:w-auto max-h-6 stroke-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    </form>
  );
};

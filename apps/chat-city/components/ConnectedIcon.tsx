import { useState } from 'react';

type Props = {
  disabled: boolean;
  sendMessage: (msg: string) => void;
};
export const MessageBox = ({ disabled, sendMessage }: Props) => {
  const [msg, setMsg] = useState<string>(undefined);

  const formHandler = (e) => {
    console.log(msg);
    sendMessage(msg);
    e.preventDefault();
  };

  return (
    <form onSubmit={formHandler} className="w-100 flex p-2 gap-2">
      <input
        className="text-black flex-grow"
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6 h-6 stroke-white stroke-[2px]"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    </form>
  );
};
export const ConnectedIcon = ({ connected }: { connected: boolean }) => {
  if (connected) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 stroke-green-400 stroke-[5px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 stroke-red-400 stroke-[5px]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

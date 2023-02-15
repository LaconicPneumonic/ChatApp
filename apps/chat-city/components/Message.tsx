export type MessageType = {
  id: string;
  userName: string;
  content: string;
  sendDate: string;
};

type Props = {
  mine: boolean;
  message: MessageType;
};

export const Message = ({ mine, message }: Props) => {
  const classAdditions = mine
    ? 'place-self-end bg-yellow-200'
    : 'place-self-start bg-slate-200';

  return (
    <div
      className={[
        'my-1 flex items-center gap-2 rounded-lg px-4 py-1 font-bold shadow-md',
        classAdditions,
      ].join(' ')}
    >
      <svg
        className="h-6 w-6 flex-none fill-slate-600 stroke-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="11" />
      </svg>
      <p>
        {message.content} - from {message.userName}
      </p>
    </div>
  );
};

const layout = () => {
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
          className="grid w-full grid-cols-1 place-content-end gap-2 overflow-auto bg-cyan-100 p-4 px-3 flex-grow"
        >
          <div className="my-1 flex items-center gap-2 place-self-start rounded-full bg-slate-200 px-4 py-1 font-bold">
            <svg
              className="h-6 w-6 flex-none fill-slate-600 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="11" />
            </svg>
            <p>guys what's up?</p>
          </div>
          <div className="my-1 flex items-center gap-2 place-self-start rounded-full bg-slate-200 px-4 py-1 font-bold">
            <svg
              className="h-6 w-6 flex-none fill-slate-600 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="11" />
            </svg>
            I'm having the worst morning of my life
          </div>
          <div className="my-1 flex items-center gap-2 place-self-end rounded-full bg-slate-800 px-4 py-1 font-bold text-white">
            Man what happened???
            <svg
              className="h-6 w-6 flex-none fill-slate-200 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="11" />
            </svg>
          </div>
          <div className="my-1 flex items-center gap-2 place-self-start rounded-full bg-slate-200 px-4 py-1 font-bold">
            <svg
              className="h-6 w-6 flex-none fill-slate-600 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="11" />
            </svg>
            I got carjacked!
          </div>
          <div className="my-1 flex items-center gap-2 place-self-start rounded-full bg-slate-200 px-4 py-1 font-bold">
            <svg
              className="h-6 w-6 flex-none fill-slate-600 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="11" />
            </svg>
            Damn you were talking shit weren't you?
          </div>
        </main>
      </div>
      <footer className="mt-auto  bg-slate-600 flex flex-row p-1">
        <div className=" border-solid border-black border-2 rounded-l-full w-9 bg-slate-200"></div>
        <input
          className="flex-grow border-solid border-black border-2 rounded-r-full bg-cyan-100 font-bold p-1"
          value="LMAOOO"
        ></input>
      </footer>
    </div>
  );
};

export default layout;

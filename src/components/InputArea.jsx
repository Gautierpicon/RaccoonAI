export default function InputArea({
    input,
    loading,
    conversation,
    onInputChange,
    onSend,
    onClear
  }) {
    return (
      <div className="outfit-font px-4 pt-4 pb-2 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-md dark:shadow-zinc-800 group focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/30 transition-all duration-200">
        <div className="relative">
          <textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!loading && input.trim()) {
                  onSend();
                }
              }
            }}
            className="w-full pb-10 bg-gray-200/75 dark:bg-zinc-800/75 text-gray-900 dark:text-zinc-300 p-4 pr-32 rounded-lg border border-gray-200 dark:border-zinc-800 focus:outline-none placeholder-gray-400 dark:placeholder-zinc-600 resize-none transition-all duration-200"
            placeholder="Write your message... 🍃"
            rows={`${
              conversation.length === 0
                ? '3'
                : '2'
              }`}
          />
          <div className="absolute right-4 bottom-4 flex space-x-2">
            {conversation.length > 0 && (
              <button
                onClick={onClear}
                className="p-2 px-3 duration-200 transform hover:scale-105 bg-red-400/30 dark:bg-red-500/70 font-semibold text-red-800 dark:text-zinc-900 rounded-full flex items-center"
              >
                Clear
              </button>
            )}
  
            <button
              onClick={onSend}
              className={`p-2 rounded-full ${
                input.trim() && !loading
                  ? 'bg-green-600/40 text-emerald-800 dark:text-zinc-900'
                  : 'bg-gray-400 text-gray-600 dark:bg-zinc-700 dark:text-zinc-900'
              } transition-all duration-200 transform ${
                input.trim() && !loading ? 'hover:scale-105' : 'cursor-not-allowed'
              } aspect-square`}
              disabled={!input.trim() || loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
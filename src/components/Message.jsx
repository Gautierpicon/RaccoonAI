export default function Message({ message }) {
    return (
      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
        <div className={`max-w-[85%] p-4 rounded-2xl ${
          message.role === 'user' 
            ? 'bg-amber-600/30 border border-amber-600/50' 
            : 'bg-gray-300/70 border border-gray-400/50'
        } shadow-md transition-transform duration-200 hover:scale-[1.01]`}>
          <div className="flex items-start space-x-3">
            {message.role === 'assistant' && (
              <div className="pt-1">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <img 
                    src="/aipicture.png"
                    alt="Ai logo" 
                    className="h-7 w-7"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 text-amber-950 font-light whitespace-pre-wrap">
              {message.role === 'assistant' && (
                <div className="text-sm font-medium text-amber-600 mb-1">
                  {message.model}
                </div>
              )}
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }
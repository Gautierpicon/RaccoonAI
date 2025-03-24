export default function Message({ message }) {
    const getIconForModel = (model) => {
      if (model.toLowerCase().includes("llama")) return "/AiIcons/llama.webp";
      if (model.toLowerCase().includes("deepseek")) return "/AiIcons/deepseek.webp";
      if (model.toLowerCase().includes("gemma3")) return "/AiIcons/gemma.webp";
      if (model.toLowerCase().includes("qwen") || model.toLowerCase().includes("qwq")) return "/AiIcons/qwen.webp";
      if (model.toLowerCase().includes("mistral")) return "/AiIcons/mistral.webp";
      return "/logo.svg";
    };
  
    return (
      <div className={`outfit-font flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
        <div className={`rounded-2xl min-w-0 ${
          message.role === 'user' 
            ? 'max-w-[85%] bg-green-600/30 dark:bg-green-800/70 shadow-sm px-4 py-2'
            : 'max-w-full bg-transparent transition-transform duration-200 p-4 my-8'
          }`}>
          <div className="flex items-start space-x-3">
            {message.role === 'assistant' && (
              <div className="pt-1">
                <div className="w-11 h-11 bg-green-500/20 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={getIconForModel(message.model)}
                    alt={`${message.model} icon`}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 text-green-950 dark:text-zinc-300 whitespace-pre-line break-words min-w-0">
              {message.role === 'assistant' && (
                <div className="text-sm font-medium text-emerald-800 dark:text-emerald-600 mb-1 underline">
                  {message.model}
                </div>
              )}
              <div className="text-xl">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
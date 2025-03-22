export default function Message({ message }) {
    const getIconForModel = (model) => {
      if (model.toLowerCase().includes("llama")) return "/AiIcons/llama.webp";
      if (model.toLowerCase().includes("deepseek")) return "/AiIcons/deepseek.webp";
      if (model.toLowerCase().includes("gemma3")) return "/AiIcons/gemma.webp";
      if (model.toLowerCase().includes("qwen")) return "/AiIcons/qwen.webp";
      if (model.toLowerCase().includes("mistral")) return "/AiIcons/mistral.webp";
      return "/logo.svg";
    };
  
    return (
      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
        <div className={`max-w-[85%] p-4 rounded-2xl min-w-0 ${
          message.role === 'user' 
            ? 'bg-amber-600/30 border border-amber-600/50' 
            : 'bg-gray-300/70 border border-gray-400/50'
        } shadow-md transition-transform duration-200 hover:scale-[1.01]`}>
          <div className="flex items-start space-x-3">
            {message.role === 'assistant' && (
              <div className="pt-1">
                <div className="w-11 h-11 bg-amber-500/20 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                        src={getIconForModel(message.model)}
                        alt={`${message.model} icon`}
                        className="object-contain w-full h-full"
                    />
                </div>
              </div>
            )}
            <div className="flex-1 text-amber-950 font-light whitespace-pre-line break-words min-w-0">
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
  
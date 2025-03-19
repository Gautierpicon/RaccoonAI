"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");

  // Fetch available models from API
  const fetchModels = async () => {
    try {
      const res = await fetch("/api/ollama/models");
      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        setModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Load models on initial mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Handle prompt submission
  const sendPrompt = async () => {
    if (input.trim() === "") return;
    
    setLoading(true);
    
    // Add user message to conversation
    const userMessage = { role: "user", content: input };
    setConversation(prev => [...prev, userMessage]);
    
    // Clear input field
    setInput("");
    
    try {
      // Get the full conversation history
      const history = [...conversation, userMessage];
      
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: input,
          model: selectedModel,
          conversation: history.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      // Handle streaming response
      if (res.headers.get('Content-Type') === 'text/event-stream') {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Add placeholder for the assistant's response with model info
        setConversation(prev => [...prev, { 
          role: "assistant", 
          content: "",
          model: selectedModel 
        }]);

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value);
          buffer += chunk;
          
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                
                if (eventData.token) {
                  setConversation(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { 
                      ...updated[updated.length - 1],
                      content: updated[updated.length - 1].content + eventData.token 
                    };
                    return updated;
                  });
                }
                
                if (eventData.error) {
                  console.error("Stream error:", eventData.error);
                  setConversation(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { 
                      ...updated[updated.length - 1],
                      content: "Error: " + eventData.error 
                    };
                    return updated;
                  });
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      } else {
        // Fallback for non-streaming responses
        const data = await res.json();
        const responseText = data.response || "No response.";
        setConversation(prev => [...prev, { 
          role: "assistant", 
          content: responseText,
          model: selectedModel 
        }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setConversation(prev => [...prev, { 
        role: "assistant", 
        content: "Error during data recovery.",
        model: selectedModel 
      }]);
    }

    setLoading(false);
  };

  // Clear conversation history
  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">
      <div className="p-4 max-w-2xl mx-auto relative">
        {/* Header with animated logo */}
        <div className="flex items-center mb-8 group">
          <div className="relative h-16 w-16 mr-3">
            <div className="absolute inset-0 rounded-full animate-pulse opacity-20"></div>
            <img 
              src="/logo.svg"
              alt="Raccoon.ai Logo" 
              className="h-16 w-16 transform transition-transform duration-300 hover:rotate-20"
            />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-amber-500">
            Raccoon.ai
          </h1>
        </div>

        {/* Model selection section */}
        {conversation.length === 0 && (
          <div className="mb-6 bg-gray-200/50 backdrop-blur-sm p-4 rounded-xl border border-gray-300 shadow-lg">
            <div className="flex items-center space-x-3">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="flex-grow bg-gray-300 text-gray-900 px-4 py-3 rounded-lg border border-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 font-mono transition-all"
              >
                {models.map((model) => (
                  <option key={model.name} value={model.name} className="bg-gray-200">
                    {model.name}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchModels}
                className="p-3 bg-gray-300 rounded-lg transition-colors duration-200 border border-gray-400 cursor-pointer aspect-square h-[48.5px]"
              >
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
            <p className="text-sm pl-2 py-1">
              For more models go to: <a href="https://ollama.com/search" target="_blank" className="underline text-blue-500">https://ollama.com/search</a>
            </p>
          </div>
        )}

        {/* Conversation display */}
        {conversation.length > 0 && (
          <div className="mb-6 bg-gray-200/50 backdrop-blur-sm rounded-xl border border-gray-300 shadow-lg overflow-hidden">
            <div className="h-96 overflow-y-auto p-4 space-y-4 relative">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
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
                        {/* Display model name for assistant messages */}
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
              ))}
            </div>
          </div>
        )}

        {/* Input area with controls */}
        <div className="bg-gray-200/50 px-4 pt-4 pb-2 backdrop-blur-sm rounded-xl border border-gray-300 shadow-lg group focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all duration-200">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendPrompt()}
              className="w-full pb-10 bg-gray-300/50 text-gray-900 p-4 pr-32 rounded-lg border border-gray-300 focus:outline-none placeholder-gray-400 resize-none transition-all duration-200"
              placeholder="Write your message... 🍃"
              rows="3"
              disabled={loading}
            />
            <div className="absolute right-4 bottom-4 flex space-x-2">
              <button
                onClick={clearConversation}
                className="p-2 px-3 duration-200 transform hover:scale-105 bg-red-400/30 text-red-800 rounded-full flex items-center"
              >
                Clear
              </button>

              <button
                onClick={sendPrompt}
                className={`p-2 rounded-full ${
                  input.trim() && !loading
                    ? 'bg-amber-500 hover:bg-amber-400 text-gray-100'
                    : 'bg-gray-400 text-gray-600'
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
      </div>
    </div>
  );
}
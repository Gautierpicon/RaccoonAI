"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [loadingModels, setLoadingModels] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  const fetchModels = async () => {
    setLoadingModels(true);
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
    setLoadingModels(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const sendPrompt = async () => {
    if (input.trim() === "") return;
    
    setLoading(true);
    setFirstTokenReceived(false); // Réinitialiser l'état du premier token
    
    // Add user message to conversation
    const userMessage = { role: "user", content: input };
    setConversation(prev => [...prev, userMessage]);
    
    // Clear input field and response
    setInput("");
    setCurrentResponse("");
    
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

        // Add placeholder for the assistant's response
        setConversation(prev => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          const chunk = decoder.decode(value);
          buffer += chunk;
          
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                
                if (eventData.token) {
                  // Update the current response
                  setCurrentResponse(prev => prev + eventData.token);
                  
                  // Update the conversation array
                  setConversation(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { 
                      role: "assistant", 
                      content: updated[updated.length - 1].content + eventData.token 
                    };
                    return updated;
                  });

                  // Marquer que le premier token a été reçu
                  if (!firstTokenReceived) {
                    setFirstTokenReceived(true);
                  }
                }
                
                if (eventData.error) {
                  console.error("Stream error:", eventData.error);
                  setCurrentResponse("Error: " + eventData.error);
                  setConversation(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { 
                      role: "assistant", 
                      content: "Error: " + eventData.error 
                    };
                    return updated;
                  });
                }
                
                if (eventData.done) {
                  // Conversation complete
                  break;
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
        setCurrentResponse(responseText);
        setConversation(prev => [...prev, { role: "assistant", content: responseText }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setCurrentResponse("Error during data recovery.");
      setConversation(prev => [...prev, { role: "assistant", content: "Error during data recovery." }]);
    }

    setLoading(false);
  };

  const clearConversation = () => {
    setConversation([]);
    setCurrentResponse("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <img src="/logo.svg" alt="Logo" className="h-12 w-12 mr-2" />
        <h1 className="text-4xl font-bold">Raccoon.ai</h1>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Model:</label>
        <div className="flex items-center">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={`border p-2 flex-grow ${conversation.length > 0 ? "cursor-not-allowed bg-gray-100" : ""}`}
            disabled={loadingModels || conversation.length > 0}
          >
            {loadingModels ? (
              <option>Loading models...</option>
            ) : (
              models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))
            )}
          </select>
          <button
            onClick={fetchModels}
            className={`ml-2 bg-gray-200 p-2 rounded ${conversation.length > 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            title="Refresh models"
            disabled={conversation.length > 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
        <p className="text-sm">
          For more models go to: <a href="https://ollama.com/search" target="_blank" className="underline text-blue-500">https://ollama.com/search</a>
        </p>
      </div>

      {/* Conversation Display */}
      <div className="mb-4 border bg-gray-100 p-2 h-64 overflow-y-auto whitespace-pre-wrap">
        {conversation.map((message, index) => (
          <div key={index} className="mb-2">
            <div className="font-bold">{message.role === "user" ? "You:" : "AI:"}</div>
            <div className="pl-2">{message.content}</div>
          </div>
        ))}
        {loading && !firstTokenReceived && <div className="text-gray-500">Loading...</div>}
      </div>

      {/* Input and Buttons */}
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 w-full h-32"
          placeholder="Enter your prompt..."
          disabled={loading}
        />
        <div className="flex mt-2 space-x-2">
          <button
            onClick={sendPrompt}
            className={`flex-grow ${
              input.trim() === "" || loading || !selectedModel
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-700 cursor-pointer"
            } text-white p-2 rounded`}
            disabled={input.trim() === "" || loading || !selectedModel}
          >
            Send
          </button>
          <button
            onClick={clearConversation}
            className={`bg-red-500 text-white p-2 rounded ${
              conversation.length === 0 || loading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={conversation.length === 0 || loading}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
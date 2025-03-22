"use client";
import { useState, useEffect } from "react";
import Header from '../components/Header';
import ModelSelector from '../components/ModelSelector';
import Conversation from '../components/Conversation';
import InputArea from '../components/InputArea';
import Footer from '../components/Footer';

export default function Home() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");

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

  useEffect(() => {
    fetchModels();
  }, []);

  const sendPrompt = async () => {
    if (input.trim() === "") return;
    
    setLoading(true);
    const userMessage = { role: "user", content: input };
    setConversation(prev => [...prev, userMessage]);
    setInput("");

    try {
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

      if (res.headers.get('Content-Type') === 'text/event-stream') {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const assistantId = Date.now();
        setConversation(prev => [...prev, { 
          role: "assistant", 
          content: "",
          model: selectedModel,
          id: assistantId
        }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                
                if (eventData.token) {
                  setConversation(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.id === assistantId) {
                      return [
                        ...prev.slice(0, -1),
                        {
                          ...lastMessage,
                          content: lastMessage.content + eventData.token
                        }
                      ];
                    }
                    return prev;
                  });
                }
                
                if (eventData.error) {
                  console.error("Stream error:", eventData.error);
                  setConversation(prev => {
                    const lastMessage = prev[prev.length - 1];
                    return [
                      ...prev.slice(0, -1),
                      {
                        ...lastMessage,
                        content: "Error: " + eventData.error
                      }
                    ];
                  });
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      } else {
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

  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="p-4 max-w-3xl mx-auto relative pb-16">
        <Header 
          conversation={conversation} 
          onClear={clearConversation}
        />
          
        {conversation.length === 0 && (
          <ModelSelector 
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        )}

        {conversation.length > 0 && <Conversation conversation={conversation} />}

        <InputArea
          input={input}
          loading={loading}
          conversation={conversation}
          onInputChange={(e) => setInput(e.target.value)}
          onSend={sendPrompt}
          onClear={clearConversation}
        />
      </div>
      
      {conversation.length === 0 && <Footer />}
    </div>
  );
}
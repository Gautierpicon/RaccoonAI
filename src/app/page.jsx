"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [loadingModels, setLoadingModels] = useState(false);

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
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: input,
          model: selectedModel
        }),
      });

      const data = await res.json();
      setResponse(data.response || "No response.");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error during data recovery.");
    }

    setLoading(false);
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
            className="border p-2 flex-grow"
            disabled={loadingModels}
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
            className="ml-2 bg-gray-200 p-2 rounded cursor-pointer"
            title="Refresh models"
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

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full h-32"
        placeholder="Enter your prompt..."
      />
      <button
        onClick={sendPrompt}
        className={`mt-2 ${
          input.trim() === "" || loading || !selectedModel
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-700 cursor-pointer"
        } text-white p-2 rounded`}
        disabled={input.trim() === "" || loading || !selectedModel}
      >
        {loading ? "Loading..." : "Send"}
      </button>
      <div className="mt-4 p-2 border bg-gray-100 min-h-[100px] whitespace-pre-wrap">
        {response}
      </div>
    </div>
  );
}
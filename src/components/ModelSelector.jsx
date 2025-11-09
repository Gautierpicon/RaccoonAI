"use client";
import { useState, useEffect } from "react";

export default function ModelSelector({ models, selectedModel, onModelChange, onModelsUpdate, showManager, setShowManager }) {
  const [pullModel, setPullModel] = useState("");
  const [pulling, setPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState("");
  const [runningModels, setRunningModels] = useState([]);

  const handlePull = async () => {
    if (!pullModel.trim()) return;
    
    setPulling(true);
    setPullProgress("");

    try {
      const res = await fetch("/api/ollama/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: pullModel }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

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
              const data = JSON.parse(line.slice(6));
              if (data.status) {
                setPullProgress(data.status);
              }
              if (data.error) {
                setPullProgress(`Error: ${data.error}`);
              }
            } catch (e) {
              console.error("Parse error:", e);
            }
          }
        }
      }

      setPullProgress("Download complete!");
      setPullModel("");
      onModelsUpdate();
    } catch (error) {
      console.error("Pull error:", error);
      setPullProgress("Error during download");
    } finally {
      setPulling(false);
    }
  };

  const handleDelete = async (modelName) => {
    if (!confirm(`Delete model ${modelName}?`)) return;

    try {
      const res = await fetch("/api/ollama/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName }),
      });

      const data = await res.json();
      if (data.success) {
        onModelsUpdate();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const fetchRunningModels = async () => {
    try {
      const res = await fetch("/api/ollama/ps");
      const data = await res.json();
      setRunningModels(data.models || []);
    } catch (error) {
      console.error("Error fetching running models:", error);
    }
  };

  useEffect(() => {
    if (showManager) {
      fetchRunningModels();
    }
  }, [showManager]);

  return (
    <div className="mb-6 mx-4">
      <div className="bg-gray-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-md dark:shadow-zinc-800">
        <div className="flex gap-2">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="flex-1 bg-gray-200/75 dark:bg-zinc-800/75 text-gray-900 dark:text-zinc-200 px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/30 font-mono transition-all"
          >
            {models.map((model) => (
              <option key={model.name} value={model.name} className="bg-gray-100 dark:bg-zinc-900">
                {model.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowManager(!showManager)}
            className="cursor-pointer px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold outfit-font flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Manage
          </button>
        </div>
      </div>

      {showManager && (
        <div className="mt-4 space-y-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 outfit-font text-emerald-700 dark:text-emerald-600">Download Model</h2>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={pullModel}
                onChange={(e) => setPullModel(e.target.value)}
                placeholder="llama3.1, mistral, qwen2.5, etc."
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-600 outfit-font"
                disabled={pulling}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !pulling && pullModel.trim()) {
                    handlePull();
                  }
                }}
              />
              <button
                onClick={handlePull}
                disabled={pulling || !pullModel.trim()}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg disabled:cursor-not-allowed cursor-pointer disabled:opacity-50 hover:bg-emerald-700 transition-colors outfit-font font-semibold"
              >
                {pulling ? "Downloading..." : "Download"}
              </button>
            </div>
            <p className="outfit-font text-sm mt-2 text-gray-900 dark:text-zinc-200">
              For more models go to: <a href="https://ollama.com/search" rel="noopener noreferrer" target="_blank" className="underline text-emerald-800 dark:text-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-600">https://ollama.com/search</a>
            </p>
            {pullProgress && (
              <div className="mt-3 p-3 bg-gray-100 dark:bg-zinc-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 outfit-font">
                  {pullProgress}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-200 dark:border-zinc-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold outfit-font text-emerald-700 dark:text-emerald-600">Running Models</h2>
              <button
                onClick={fetchRunningModels}
                className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors outfit-font"
              >
                Refresh
              </button>
            </div>
            {runningModels.length === 0 ? (
              <p className="text-gray-500 outfit-font">No models running</p>
            ) : (
              <ul className="space-y-2">
                {runningModels.map((model, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-zinc-900 rounded outfit-font">
                    <span>{model.name}</span>
                    <span className="text-sm text-gray-500">{model.size}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 outfit-font text-emerald-700 dark:text-emerald-600">Installed Models ({models.length})</h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {models.map((model) => (
                <li key={model.name} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-zinc-900 rounded">
                  <div className="outfit-font flex-1">
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500">{(model.size / 1e9).toFixed(2)} GB</div>
                  </div>
                  <button
                    onClick={() => handleDelete(model.name)}
                    className="cursor-pointer px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors outfit-font ml-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
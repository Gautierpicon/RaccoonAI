export default function ModelSelector({ models, selectedModel, onModelChange }) {
    return (
      <div className="mb-6 bg-gray-200/50 backdrop-blur-sm p-4 rounded-xl border border-gray-300 shadow-lg">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full bg-gray-300 text-gray-900 px-4 py-3 rounded-lg border border-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 font-mono transition-all"
        >
          {models.map((model) => (
            <option key={model.name} value={model.name} className="bg-gray-200">
              {model.name}
            </option>
          ))}
        </select>
        <p className="text-sm pl-2 py-1">
          For more models go to: <a href="https://ollama.com/search" target="_blank" className="underline text-blue-500">https://ollama.com/search</a>
        </p>
      </div>
    );
  }
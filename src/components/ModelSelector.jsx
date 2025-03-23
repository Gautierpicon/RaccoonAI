export default function ModelSelector({ models, selectedModel, onModelChange }) {
    return (
      <div className="mb-6 bg-gray-100/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/30 font-mono transition-all"
        >
          {models.map((model) => (
            <option key={model.name} value={model.name} className="bg-gray-100">
              {model.name}
            </option>
          ))}
        </select>
        <p className="text-sm pl-1 py-1">
          For more models go to: <a href="https://ollama.com/search" rel="noopener noreferrer" target="_blank" className="underline text-emerald-800 hover:text-emerald-700">https://ollama.com/search</a>
        </p>
      </div>
    );
  }
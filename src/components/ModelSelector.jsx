export default function ModelSelector({ models, selectedModel, onModelChange }) {
    return (
      <div className="mb-6 mx-4 bg-gray-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-md dark:shadow-zinc-800">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full bg-gray-200/75 dark:bg-zinc-800/75 text-gray-900 dark:text-zinc-200 px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/30 font-mono transition-all"
        >
          {models.map((model) => (
            <option key={model.name} value={model.name} className="bg-gray-100 dark:bg-zinc-900">
              {model.name}
            </option>
          ))}
        </select>
        <p className="text-sm pl-1 py-1 text-gray-900 dark:text-zinc-200">
          For more models go to: <a href="https://ollama.com/search" rel="noopener noreferrer" target="_blank" className="underline text-emerald-800 dark:text-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-600">https://ollama.com/search</a>
        </p>
      </div>
    );
  }
export default function Footer() {
    return (
      <footer className="fixed bottom-0 left-0 right-0 py-2 px-4 backdrop-blur-sm border-t border-gray-300 shadow-sm">
        <div className="container max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Raccoon.ai Logo" className="h-4 w-4 mr-2" />
            <span className="text-emerald-700 text-xs">Raccoon.ai</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <a 
              href="https://github.com/Gautierpicon/RaccoonAI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline flex items-center"
            >
              GitHub
            </a>
            <a 
              href="https://ollama.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline"
            >
              Ollama
            </a>
            
            <span className="text-xs text-gray-500">
                Made with 🌱 for local AI enthusiasts
            </span>
          </div>
        </div>
      </footer>
    );
  }
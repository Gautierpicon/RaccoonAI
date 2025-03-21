export default function Header() {
    return (
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
    );
  }
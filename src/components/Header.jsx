export default function Header() {
    return (
        <div className="flex items-center mb-8">
            <a href="https://github.com/Gautierpicon/RaccoonAI" target="_blank" className="flex items-center group">
                <div className="relative h-16 w-16 mr-3">
                    <img
                        src="/logo.svg"
                        alt="Raccoon.ai Logo"
                        className="h-16 w-16 transform transition-transform duration-300 group-hover:rotate-20"
                    />
                </div>
                <h1 className="bricolage-font text-4xl bg-clip-text text-emerald-700 group-hover:underline">
                    Raccoon.ai
                </h1>
            </a>
        </div>
    );
}
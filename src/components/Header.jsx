export default function Header({ conversation, onClear }) {
    const isLink = conversation.length === 0;
    const Wrapper = isLink ? 'a' : 'button';
    
    const wrapperProps = {
        className: "flex items-center group",
        ...(isLink ? { 
            href: "https://github.com/Gautierpicon/RaccoonAI", 
            target: "_blank" 
        } : { 
            onClick: onClear, 
            type: "button",
            className: "flex items-center group cursor-pointer" 
        })
    };

    return (
        <div className="flex items-center mb-8">
            <Wrapper {...wrapperProps}>
                <div className="relative h-16 w-16 mr-3">
                    <img
                        src="/logo.svg"
                        alt="RaccoonAI Logo"
                        className="h-16 w-16 transform transition-transform duration-300 group-hover:rotate-20"
                    />
                </div>
                <h1 className="bricolage-font text-4xl bg-clip-text text-emerald-700 group-hover:underline">
                    RaccoonAI
                </h1>
            </Wrapper>
        </div>
    );
}
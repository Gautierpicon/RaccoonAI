import Message from './Message';

export default function Conversation({ conversation }) {
  return (
    <div className="mb-6 bg-gray-200/50 backdrop-blur-sm rounded-xl border border-gray-300 shadow-lg overflow-hidden">
      <div className="h-96 overflow-y-auto p-4 space-y-4 relative">
        {conversation.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}
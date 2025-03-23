import Message from './Message';

export default function Conversation({ conversation }) {
  return (
    <div className="mb-6 bg-transparent overflow-hidden">
      <div className="h-96 overflow-y-auto p-4 space-y-4 relative">
        {conversation.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}
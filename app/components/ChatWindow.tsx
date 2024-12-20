interface ChatWindowProps {
  messages: { role: string; content: string }[];
}

// Component for rendering a chat window
const ChatWindow = ({ messages }: ChatWindowProps) => (
  <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg mb-4">
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 rounded-lg ${
            msg.role === "user"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
          {msg.content}
        </div>
      ))}
    </div>
  </div>
);

export default ChatWindow;

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Change to your server URL if different

const LiveChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Listen for new messages from the server
  useEffect(() => {
    socket.on("receive_message", (newMessage: string) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup when component is unmounted
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      // Send the message to the server
      socket.emit("send_message", message);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div>
      <div>
        <h3>Live Chat</h3>
        <div
          style={{
            maxHeight: "300px",
            overflowY: "scroll",
            border: "1px solid #ddd",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <p>{msg}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default LiveChat;

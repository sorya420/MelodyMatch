

import { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardChatContainer.css";

const DashboardChatContainer = ({ user, matchedUser , onClose }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const userId = user?.user_id;
  const matchedUserId = matchedUser?.user_id;

  // Load messages
 useEffect(() => {
  let interval;

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/messages`
, {
        params: {
          userId,
          correspondingUserId: matchedUserId,
        },
      });
      setChat(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  if (userId && matchedUserId) {
    fetchMessages(); // Initial fetch
    interval = setInterval(fetchMessages, 3000); // Re-fetch every 3 seconds
  }

  return () => clearInterval(interval); // Cleanup
}, [userId, matchedUserId]);


  // Send a message
  const handleSend = async () => {
    if (!message.trim()) return;

    const newMsg = {
      timestamp: new Date().toISOString(),
      from_userId: userId,
      to_userId: matchedUserId,
      message,
    };

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/message`
, { message: newMsg });
      setChat((prev) => [...prev, newMsg]);
      setMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="chat-container">
      <h3>Chat with {matchedUser.first_name}</h3>
       <button className="close-chat" onClick={onClose}>✖</button>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.from_userId === userId ? "msg-you" : "msg-them"}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default DashboardChatContainer;

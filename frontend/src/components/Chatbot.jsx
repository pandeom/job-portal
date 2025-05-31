import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const chatWindowRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://localhost:8000/api/chatbot", { prompt: input });
      const botMessage = {
        sender: "bot",
        text: response.data.message,
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error communicating with the chatbot:", error.message);
      const errorMessage = {
        sender: "bot",
        text: "Oops! Something went wrong. Please try again later.",
      };
      setMessages([...messages, userMessage, errorMessage]);
    }

    setInput("");
  };

  const handleClickOutside = (event) => {
    if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={styles.container}>
      {!isOpen && (
        <div style={styles.chatIcon} onClick={() => setIsOpen(true)}>
          <span style={styles.iconText}>Chat</span>
        </div>
      )}

      {isOpen && (
        <div style={styles.chatWindow} ref={chatWindowRef}>
          <div style={styles.chatHeader}>
            <span>Chatbot</span>
            <button style={styles.closeButton} onClick={() => setIsOpen(false)}>X</button>
          </div>
          <div style={styles.chatbox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#E6C6F2" : "#D3A4D7",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button style={styles.button} onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
  },
  chatIcon: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    backgroundColor: "#6A4C9C",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  iconText: {
    fontSize: "12px",
    fontWeight: "bold",
  },
  chatWindow: {
    position: "absolute",
    bottom: "80px",
    right: "20px",
    width: "300px",
    maxHeight: "400px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatHeader: {
    backgroundColor: "#6A4C9C",
    color: "#fff",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  chatbox: {
    flex: 1,
    padding: "10px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "#6A4C9C",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Chatbot;

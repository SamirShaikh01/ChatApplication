import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import React from "react";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { authUser, socket } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  // Fetch all users for sidebar
  const getUsers = async () => {
    const { data } = await axios.get("/api/messages/users");
    if (data.success) {
      setUsers(data.users);
      setUnseenMessages(data.unseenMessages || {});
    }
  };

  // Fetch all messages for selected user
  const getMessages = async (id) => {
    const { data } = await axios.get(`/api/messages/${id}`);
    if (data.success) setMessages(data.messages);
  };

  // Send message
  const sendMessage = async (body) => {
    if (!selectedUser) return;
    const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, body);
    if (data.success) {
      setMessages((prev) => [...prev, data.newMessage]); // Add your own message immediately
    }
  };

  // 🔥 Listen for new messages from backend socket
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // Check if the message belongs to the currently opened chat
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // Otherwise, increment unseen message count for that user
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });

    // Cleanup listener when component unmounts
    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        users,
        messages,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
        unseenMessages,
        setUnseenMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

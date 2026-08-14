import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = io(SOCKET_URL, { auth: { token: user.token } });
    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("chat:started", ({ conversation }) => setConversation(conversation));

    s.on("chat:message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    if (user.role === "client") {
      s.emit("chat:start");
    }

    return () => s.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const sendMessage = (conversationId, text) => {
    socketRef.current?.emit("chat:message", { conversationId, text });
  };

  const joinConversation = (conversationId) => {
    socketRef.current?.emit("chat:join", { conversationId });
  };

  const setTyping = (conversationId, isTyping) => {
    socketRef.current?.emit("chat:typing", { conversationId, isTyping });
  };

  const markRead = (conversationId) => {
    socketRef.current?.emit("chat:read", { conversationId });
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        connected,
        messages,
        setMessages,
        conversation,
        setConversation,
        sendMessage,
        joinConversation,
        setTyping,
        markRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

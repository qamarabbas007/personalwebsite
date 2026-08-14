import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { getConversationMessages } from "../../../services/chatApi";
import useSocket from "../../../hooks/useSocket";
import useAuth from "../../../hooks/useAuth";
import { formatTime, formatDate } from "../../../utils/helpers";

const ChatConversation = ({ conversation }) => {
  const { user } = useAuth();
  const { sendMessage, joinConversation, markRead, socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conversation?._id) return;
    joinConversation(conversation._id);
    getConversationMessages(conversation._id).then(({ data }) => setMessages(data.messages));
    markRead(conversation._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?._id]);

  useEffect(() => {
    if (!socket) return;
    const handler = (message) => {
      if (message.conversation === conversation?._id) setMessages((prev) => [...prev, message]);
    };
    socket.on("chat:message", handler);
    return () => socket.off("chat:message", handler);
  }, [socket, conversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(conversation._id, text.trim());
    setText("");
  };

  if (!conversation) {
    return <div className="admin-chat-empty">Select a conversation to start replying.</div>;
  }

  return (
    <div className="admin-chat-conversation">
      <div className="admin-chat-messages">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`chat-bubble ${(m.sender?._id || m.sender) === user?._id ? "chat-bubble-me" : "chat-bubble-them"}`}
          >
            <p>{m.text}</p>
            <span className="chat-bubble-time">{formatDate(m.createdAt)} · {formatTime(m.createdAt)}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="admin-chat-input" onSubmit={handleSend}>
        <input className="form-control" placeholder="Type a reply..." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn btn-primary" type="submit"><FiSend /></button>
      </form>
    </div>
  );
};

export default ChatConversation;

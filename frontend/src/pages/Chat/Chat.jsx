import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import { getConversationMessages } from "../../services/chatApi";
import { formatTime, formatDate } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";
import "./Chat.css";

const Chat = () => {
  const { user } = useAuth();
  const { conversation, messages, setMessages, sendMessage, joinConversation, markRead, connected } = useSocket();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (conversation?._id) {
      joinConversation(conversation._id);
      getConversationMessages(conversation._id)
        .then(({ data }) => setMessages(data.messages))
        .finally(() => setLoading(false));
      markRead(conversation._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversation?._id) return;
    sendMessage(conversation._id, text.trim());
    setText("");
  };

  return (
    <main className="page-wrapper">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-heading">
          <span className="eyebrow">Direct Message</span>
          <h1>Chat with Qamar Abbas</h1>
          <p>{connected ? "Connected — replies usually within a day." : "Connecting..."}</p>
        </div>

        <div className="glass-card chat-page-box">
          <div className="chat-page-messages">
            {loading ? <Loading /> : messages.length === 0 ? (
              <p className="text-muted text-center">No messages yet — send your first message below.</p>
            ) : (
              messages.map((m) => (
                <div key={m._id} className={`chat-bubble ${(m.sender?._id || m.sender) === user?._id ? "chat-bubble-me" : "chat-bubble-them"}`}>
                  <p>{m.text}</p>
                  <span className="chat-bubble-time">{formatDate(m.createdAt)} · {formatTime(m.createdAt)}</span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form className="chat-page-input" onSubmit={handleSend}>
            <input
              className="form-control"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary"><FiSend /></button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Chat;

import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiX, FiSend, FiUser, FiUserCheck } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import { getConversationMessages } from "../../services/chatApi";
import { sendAiMessage, getAiHistory } from "../../services/aiChatApi";
import { formatTime, getAiSessionId, classNames } from "../../utils/helpers";
import "./ChatWidget.css";

// Two modes:
//  - "ai": public AI assistant, no login required, answers portfolio/service questions
//  - "human": real-time chat with Qamar himself (existing Socket.IO flow), requires login
const ChatWidget = () => {
  const { user } = useAuth();
  const { conversation, messages, setMessages, sendMessage, joinConversation, markRead } = useSocket();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("ai");
  const [text, setText] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiError, setAiError] = useState("");
  const sessionIdRef = useRef(getAiSessionId());
  const bottomRef = useRef(null);

  // Load AI history once, on first open
  useEffect(() => {
    if (open && mode === "ai" && aiMessages.length === 0) {
      getAiHistory(sessionIdRef.current)
        .then(({ data }) => setAiMessages(data))
        .catch(() => {});
    }
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load human conversation history when switching to that tab
  useEffect(() => {
    if (open && mode === "human" && conversation?._id) {
      joinConversation(conversation._id);
      getConversationMessages(conversation._id)
        .then(({ data }) => setMessages(data.messages))
        .catch(() => {});
      markRead(conversation._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, conversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiMessages, aiThinking]);

  const handleSendAi = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || aiThinking) return;
    setText("");
    setAiError("");
    setAiMessages((prev) => [...prev, { _id: `local-${Date.now()}`, role: "user", text: value }]);
    setAiThinking(true);
    try {
      const { data } = await sendAiMessage(sessionIdRef.current, value);
      setAiMessages((prev) => [...prev, data]);
    } catch (err) {
      setAiError(err.message || "The AI assistant is unavailable right now.");
    } finally {
      setAiThinking(false);
    }
  };

  const handleSendHuman = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversation?._id) return;
    sendMessage(conversation._id, text.trim());
    setText("");
  };

  const handleSubmit = mode === "ai" ? handleSendAi : handleSendHuman;

  return (
    <div className="chat-widget-root">
      {open && (
        <div className="chat-widget-panel glass-card">
          <div className="chat-widget-header">
            <div>
              <h4>{mode === "ai" ? "AI Assistant" : "Chat with Qamar"}</h4>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                {mode === "ai" ? "Ask about skills, services & pricing" : "Usually replies within a day"}
              </span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><FiX /></button>
          </div>

          <div className="chat-widget-tabs">
            <button
              className={classNames("chat-tab", mode === "ai" && "chat-tab-active")}
              onClick={() => setMode("ai")}
            >
              <FiMessageCircle /> AI Assistant
            </button>
            <button
              className={classNames("chat-tab", mode === "human" && "chat-tab-active")}
              onClick={() => setMode("human")}
            >
              {user ? <FiUserCheck /> : <FiUser />} Talk to Qamar
            </button>
          </div>

          <div className="chat-widget-body">
            {mode === "ai" && (
              <>
                {aiMessages.length === 0 && !aiThinking && (
                  <p className="text-muted" style={{ padding: "16px" }}>
                    Hi! Ask me about Qamar's skills, services, past projects or pricing — or say hello.
                  </p>
                )}
                {aiMessages.map((m) => (
                  <div key={m._id} className={`chat-bubble ${m.role === "user" ? "chat-bubble-me" : "chat-bubble-them"}`}>
                    <p>{m.text}</p>
                    {m.createdAt && <span className="chat-bubble-time">{formatTime(m.createdAt)}</span>}
                  </div>
                ))}
                {aiThinking && (
                  <div className="chat-bubble chat-bubble-them chat-bubble-typing">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                )}
                {aiError && <p className="form-error" style={{ padding: "0 4px" }}>{aiError}</p>}
                <p className="chat-widget-switch-hint">
                  Want a human? <button type="button" onClick={() => setMode("human")}>Talk to Qamar directly →</button>
                </p>
              </>
            )}

            {mode === "human" && (
              <>
                {!user && (
                  <p className="text-muted" style={{ padding: "16px" }}>
                    Please <a href="/login" className="gradient-text">log in</a> to start a direct conversation with Qamar.
                  </p>
                )}
                {user && messages.length === 0 && (
                  <p className="text-muted" style={{ padding: "16px" }}>
                    Say hello — describe your project and I'll get back to you shortly.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className={`chat-bubble ${(m.sender?._id || m.sender) === user?._id ? "chat-bubble-me" : "chat-bubble-them"}`}
                  >
                    <p>{m.text}</p>
                    <span className="chat-bubble-time">{formatTime(m.createdAt)}</span>
                  </div>
                ))}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {(mode === "ai" || (mode === "human" && user)) && (
            <form className="chat-widget-input" onSubmit={handleSubmit}>
              <input
                className="form-control"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={mode === "ai" && aiThinking}
              />
              <button type="submit" className="btn btn-primary" aria-label="Send" disabled={mode === "ai" && aiThinking}>
                <FiSend />
              </button>
            </form>
          )}
        </div>
      )}

      <button className="chat-widget-fab" onClick={() => setOpen((o) => !o)} aria-label="Toggle chat">
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ChatWidget;

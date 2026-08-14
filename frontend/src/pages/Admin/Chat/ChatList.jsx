import { useEffect, useState } from "react";
import { getConversations } from "../../../services/chatApi";
import { formatTime } from "../../../utils/helpers";
import { classNames } from "../../../utils/helpers";

const ChatList = ({ activeId, onSelect }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getConversations().then(({ data }) => setConversations(data));
  }, []);

  return (
    <div className="admin-chat-list">
      {conversations.map((c) => (
        <div
          key={c._id}
          className={classNames("admin-chat-list-item", activeId === c._id && "admin-chat-list-item-active")}
          onClick={() => onSelect(c)}
        >
          <div>
            <h4>{c.client?.name} {c.client?.isOnline && <span style={{ color: "#22c55e" }}>●</span>}</h4>
            <p>{c.lastMessage || "No messages yet"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="text-muted" style={{ fontSize: "0.72rem" }}>{formatTime(c.lastMessageAt)}</span>
            {c.unreadByAdmin > 0 && <div className="badge badge-new mt-1">{c.unreadByAdmin}</div>}
          </div>
        </div>
      ))}
      {conversations.length === 0 && <p className="text-muted" style={{ padding: 18 }}>No conversations yet.</p>}
    </div>
  );
};

export default ChatList;

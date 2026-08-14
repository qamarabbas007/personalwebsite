import { useState } from "react";
import ChatList from "./ChatList";
import ChatConversation from "./ChatConversation";
import "./Chat.css";

const AdminChat = () => {
  const [active, setActive] = useState(null);

  return (
    <div>
      <div className="admin-page-header"><h2>Client Chats</h2></div>
      <div className="admin-chat-layout">
        <ChatList activeId={active?._id} onSelect={setActive} />
        <ChatConversation conversation={active} />
      </div>
    </div>
  );
};

export default AdminChat;

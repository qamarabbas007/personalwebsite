import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMessages } from "../../../services/messageApi";
import { getProjects } from "../../../services/projectApi";
import { getBlogs } from "../../../services/blogApi";
import { getConversations } from "../../../services/chatApi";
import { clientsApi } from "../../../services/contentApi";
import Loading from "../../../components/Loading/Loading";
import { formatDate } from "../../../utils/helpers";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMessages({ limit: 200 }),
      getProjects({ limit: 200 }),
      getBlogs({ limit: 200 }),
      getConversations(),
      clientsApi.getAll({ limit: 200 }),
    ]).then(([messages, projects, blogs, conversations, clients]) => {
      setStats({
        totalProjects: projects.total ?? projects.data.length,
        totalMessages: messages.total ?? messages.data.length,
        unreadMessages: messages.data.filter((m) => !m.read).length,
        totalClients: clients.total ?? clients.data.length,
        activeChats: conversations.data.filter((c) => c.status === "Open").length,
        blogPosts: blogs.total ?? blogs.data.length,
      });
      setRecentMessages(messages.data.slice(0, 5));
      setRecentConversations(conversations.data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading fullPage />;

  const cards = [
    { label: "Total Projects", value: stats.totalProjects },
    { label: "Total Messages", value: stats.totalMessages },
    { label: "Unread Messages", value: stats.unreadMessages },
    { label: "Total Clients", value: stats.totalClients },
    { label: "Active Chats", value: stats.activeChats },
    { label: "Blog Posts", value: stats.blogPosts },
  ];

  return (
    <div>
      <div className="admin-page-header"><h2>Dashboard</h2></div>

      <div className="dashboard-grid">
        {cards.map((c) => (
          <div key={c.label} className="glass-card admin-stat-card">
            <h3 className="gradient-text">{c.value}</h3>
            <p className="text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-recent">
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="flex-between mb-2">
            <h3>Recent Messages</h3>
            <Link to="/admin/messages" className="text-muted" style={{ fontSize: "0.85rem" }}>View all →</Link>
          </div>
          {recentMessages.map((m) => (
            <div key={m._id} className="dashboard-list-item">
              <strong>{m.name}</strong> <span className="text-muted">— {formatDate(m.createdAt)}</span>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>{m.message.slice(0, 70)}...</p>
            </div>
          ))}
          {recentMessages.length === 0 && <p className="text-muted">No messages yet.</p>}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div className="flex-between mb-2">
            <h3>Recent Chats</h3>
            <Link to="/admin/chat" className="text-muted" style={{ fontSize: "0.85rem" }}>View all →</Link>
          </div>
          {recentConversations.map((c) => (
            <div key={c._id} className="dashboard-list-item">
              <strong>{c.client?.name}</strong>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>{c.lastMessage || "No messages yet"}</p>
            </div>
          ))}
          {recentConversations.length === 0 && <p className="text-muted">No conversations yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

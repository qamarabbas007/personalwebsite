import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMessages, deleteMessage } from "../../../services/messageApi";
import Loading from "../../../components/Loading/Loading";
import { formatDate } from "../../../utils/helpers";
import { MESSAGE_STATUSES } from "../../../utils/constants";
import "../shared/AdminTable.css";

const statusClass = (status) => ({
  New: "badge-new",
  "In Progress": "badge-progress",
  Replied: "badge-replied",
  Completed: "badge-completed",
}[status] || "");

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getMessages({ limit: 200, status: status || undefined }).then(({ data }) => setMessages(data)).finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await deleteMessage(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Messages</h2>
        <select className="form-control" style={{ maxWidth: 200 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {MESSAGE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Project Type</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id}>
                  <td>{m.name} {!m.read && <span className="badge badge-new" style={{ marginLeft: 6 }}>New</span>}</td>
                  <td>{m.email}</td>
                  <td>{m.projectType || "—"}</td>
                  <td><span className={`badge ${statusClass(m.status)}`}>{m.status}</span></td>
                  <td>{formatDate(m.createdAt)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/messages/${m._id}`} className="btn btn-outline btn-sm">View</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(m._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && <tr><td colSpan={6} className="text-muted">No messages found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MessageList;

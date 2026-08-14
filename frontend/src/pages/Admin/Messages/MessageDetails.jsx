import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessage, updateMessageStatus } from "../../../services/messageApi";
import Loading from "../../../components/Loading/Loading";
import { formatDate } from "../../../utils/helpers";
import { MESSAGE_STATUSES } from "../../../utils/constants";

const MessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMessage(id).then(({ data }) => setMessage(data)).finally(() => setLoading(false));
  }, [id]);

  const onStatusChange = async (e) => {
    setSaving(true);
    const { data } = await updateMessageStatus(id, e.target.value);
    setMessage(data);
    setSaving(false);
  };

  if (loading) return <Loading />;
  if (!message) return <p className="text-muted">Message not found.</p>;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Message from {message.name}</h2>
        <button className="btn btn-outline btn-sm" onClick={() => navigate("/admin/messages")}>Back</button>
      </div>

      <div className="glass-card" style={{ padding: 28, maxWidth: 640 }}>
        <p className="text-muted">From</p>
        <p className="mb-2">{message.name} — {message.email}</p>

        <p className="text-muted">Project Type / Budget</p>
        <p className="mb-2">{message.projectType || "—"} · {message.budget || "—"}</p>

        <p className="text-muted">Received</p>
        <p className="mb-2">{formatDate(message.createdAt)}</p>

        <p className="text-muted">Message</p>
        <p className="mb-3" style={{ whiteSpace: "pre-line" }}>{message.message}</p>

        <div className="form-group" style={{ maxWidth: 220 }}>
          <label>Status</label>
          <select className="form-control" value={message.status} onChange={onStatusChange} disabled={saving}>
            {MESSAGE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <a href={`mailto:${message.email}`} className="btn btn-primary mt-2">Reply via Email</a>
      </div>
    </div>
  );
};

export default MessageDetails;

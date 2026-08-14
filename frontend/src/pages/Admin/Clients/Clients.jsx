import { useEffect, useState } from "react";
import { clientsApi } from "../../../services/contentApi";
import Loading from "../../../components/Loading/Loading";
import "../shared/AdminTable.css";

// Clients are created automatically on client registration — admin can only view/annotate/remove them.
const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    clientsApi.getAll({ limit: 200 }).then(({ data }) => setClients(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm("Remove this client record?")) return;
    await clientsApi.remove(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header"><h2>Clients</h2></div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Company</th><th>Online</th><th>Projects Requested</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c._id}>
                  <td>{c.user?.name}</td>
                  <td>{c.user?.email}</td>
                  <td>{c.company || "—"}</td>
                  <td>{c.user?.isOnline ? "🟢 Online" : "⚪ Offline"}</td>
                  <td>{c.projectsRequested}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => onDelete(c._id)}>Remove</button></td>
                </tr>
              ))}
              {clients.length === 0 && <tr><td colSpan={6} className="text-muted">No clients yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminClients;

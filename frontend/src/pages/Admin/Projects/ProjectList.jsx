import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getProjects, deleteProject } from "../../../services/projectApi";
import Loading from "../../../components/Loading/Loading";
import "../shared/AdminTable.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getProjects({ limit: 200 }).then(({ data }) => setProjects(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Projects</h2>
        <Link to="/admin/projects/new" className="btn btn-primary"><FiPlus /> Add Project</Link>
      </div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>{p.status}</td>
                  <td>{p.featured ? "Yes" : "No"}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/projects/${p._id}/edit`} className="btn btn-outline btn-sm"><FiEdit2 /></Link>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(p._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && <tr><td colSpan={5} className="text-muted">No projects yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

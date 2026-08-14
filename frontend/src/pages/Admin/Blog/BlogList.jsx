import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getBlogs, deleteBlog } from "../../../services/blogApi";
import Loading from "../../../components/Loading/Loading";
import { formatDate } from "../../../utils/helpers";
import "../shared/AdminTable.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getBlogs({ limit: 200 }).then(({ data }) => setBlogs(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteBlog(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Blog Posts</h2>
        <Link to="/admin/blog/new" className="btn btn-primary"><FiPlus /> New Post</Link>
      </div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Category</th><th>Published</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id}>
                  <td>{b.title}</td>
                  <td>{b.category}</td>
                  <td>{b.published ? "Yes" : "Draft"}</td>
                  <td>{b.views}</td>
                  <td>{formatDate(b.createdAt)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/blog/${b._id}/edit`} className="btn btn-outline btn-sm"><FiEdit2 /></Link>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(b._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && <tr><td colSpan={6} className="text-muted">No posts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogList;

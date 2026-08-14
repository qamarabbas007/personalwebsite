import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import Loading from "../../../components/Loading/Loading";
import Modal from "../../../components/Modal/Modal";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import "./AdminTable.css";

/**
 * Reusable admin list/create/edit/delete page.
 * Driven by a `fields` config so each resource (Skills, Services, Experience,
 * Testimonials, Blog, Clients...) gets its own full CRUD page without
 * duplicating the table/modal/form boilerplate.
 *
 * fields: [{ name, label, type: 'text'|'textarea'|'number'|'select', options?, column?: true }]
 */
const emptyFromFields = (fields) =>
  fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === "number" ? 0 : "" }), {});

const AdminCrudPage = ({ title, api, fields, columns }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyFromFields(fields));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.getAll({ limit: 200 }).then(({ data }) => setItems(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyFromFields(fields));
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(fields.reduce((acc, f) => ({ ...acc, [f.name]: item[f.name] ?? "" }), {}));
    setError("");
    setModalOpen(true);
  };

  const onChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.update(editing._id, form);
      } else {
        await api.create(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    await api.remove(id);
    load();
  };

  const displayColumns = columns || fields.filter((f) => f.column !== false).slice(0, 4);

  return (
    <div>
      <div className="admin-page-header">
        <h2>{title}</h2>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add New</button>
      </div>

      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {displayColumns.map((c) => <th key={c.name}>{c.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {displayColumns.map((c) => (
                    <td key={c.name}>{String(item[c.name] ?? "—").slice(0, 60)}</td>
                  ))}
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><FiEdit2 /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(item._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={displayColumns.length + 1} className="text-muted">No records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${title}` : `Add ${title}`}
      >
        <form onSubmit={onSubmit}>
          {fields.map((f) => (
            <div className="form-group" key={f.name}>
              <label>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea className="form-control" name={f.name} value={form[f.name]} onChange={onChange} />
              ) : f.type === "select" ? (
                <select className="form-control" name={f.name} value={form[f.name]} onChange={onChange}>
                  <option value="">Select...</option>
                  {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : f.type === "image" || f.type === "pdf" ? (
                <ImageUpload
                  value={form[f.name]}
                  onChange={(url) => setForm({ ...form, [f.name]: url })}
                  accept={f.type}
                  label={f.label}
                />
              ) : (
                <input
                  className="form-control"
                  type={f.type === "number" ? "number" : "text"}
                  name={f.name}
                  value={form[f.name]}
                  onChange={onChange}
                />
              )}
            </div>
          ))}
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary btn-block mt-2" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCrudPage;

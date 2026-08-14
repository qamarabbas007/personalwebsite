import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjects, createProject, updateProject } from "../../../services/projectApi";
import { PROJECT_CATEGORIES } from "../../../utils/constants";
import Loading from "../../../components/Loading/Loading";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";

const empty = {
  title: "", description: "", shortDescription: "", thumbnail: "",
  technologies: "", category: "MERN", liveUrl: "", githubUrl: "",
  featured: false, status: "Completed",
};

// Shared form used by both AddProject and EditProject
const ProjectForm = ({ mode }) => {
  const { id } = useParams();
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getProjects({ limit: 200 }).then(({ data }) => {
      const project = data.find((p) => p._id === id);
      if (project) setForm({ ...project, technologies: (project.technologies || []).join(", ") });
    }).finally(() => setLoading(false));
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean) };
      if (isEdit) await updateProject(id, payload);
      else await createProject(payload);
      navigate("/admin/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="admin-page-header"><h2>{isEdit ? "Edit Project" : "Add Project"}</h2></div>
      <form className="glass-card" style={{ padding: 28, maxWidth: 720 }} onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" name="title" value={form.title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Short Description</label>
          <input className="form-control" name="shortDescription" value={form.shortDescription} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Full Description</label>
          <textarea className="form-control" name="description" rows={5} value={form.description} onChange={onChange} required />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Thumbnail</label>
            <ImageUpload
              value={form.thumbnail}
              onChange={(url) => setForm({ ...form, thumbnail: url })}
              accept="image"
              label="Thumbnail"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="form-control" name="category" value={form.category} onChange={onChange}>
              {PROJECT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Live URL</label>
            <input className="form-control" name="liveUrl" value={form.liveUrl} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input className="form-control" name="githubUrl" value={form.githubUrl} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Technologies (comma separated)</label>
          <input className="form-control" name="technologies" value={form.technologies} onChange={onChange} />
        </div>
        <div className="flex gap-3 mb-3">
          <label className="flex gap-1"><input type="checkbox" name="featured" checked={form.featured} onChange={onChange} /> Featured</label>
          <select className="form-control" name="status" value={form.status} onChange={onChange} style={{ maxWidth: 180 }}>
            <option>Completed</option>
            <option>In Progress</option>
          </select>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Project"}</button>
      </form>
    </div>
  );
};

export default ProjectForm;

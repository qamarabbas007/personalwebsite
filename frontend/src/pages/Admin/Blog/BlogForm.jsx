import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogs, createBlog, updateBlog } from "../../../services/blogApi";
import Loading from "../../../components/Loading/Loading";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";

const empty = { title: "", excerpt: "", content: "", coverImage: "", category: "General", tags: "", featured: false, published: true };

const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getBlogs({ limit: 200 }).then(({ data }) => {
      const post = data.find((p) => p._id === id);
      if (post) setForm({ ...post, tags: (post.tags || []).join(", ") });
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
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (isEdit) await updateBlog(id, payload);
      else await createBlog(payload);
      navigate("/admin/blog");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="admin-page-header"><h2>{isEdit ? "Edit Post" : "New Post"}</h2></div>
      <form className="glass-card" style={{ padding: 28, maxWidth: 720 }} onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" name="title" value={form.title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Excerpt</label>
          <input className="form-control" name="excerpt" value={form.excerpt} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea className="form-control" name="content" rows={8} value={form.content} onChange={onChange} required />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Cover Image</label>
            <ImageUpload
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
              accept="image"
              label="Cover Image"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input className="form-control" name="category" value={form.category} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input className="form-control" name="tags" value={form.tags} onChange={onChange} />
        </div>
        <div className="flex gap-3 mb-3">
          <label className="flex gap-1"><input type="checkbox" name="featured" checked={form.featured} onChange={onChange} /> Featured</label>
          <label className="flex gap-1"><input type="checkbox" name="published" checked={form.published} onChange={onChange} /> Published</label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Post"}</button>
      </form>
    </div>
  );
};

export default BlogForm;

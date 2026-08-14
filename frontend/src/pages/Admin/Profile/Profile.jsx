import { useEffect, useState } from "react";
import { profileApi } from "../../../services/contentApi";
import Loading from "../../../components/Loading/Loading";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";

const Profile = () => {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    profileApi.get().then(({ data }) => setForm(data));
  }, []);

  if (!form) return <Loading />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onStatChange = (e) => setForm({ ...form, stats: { ...form.stats, [e.target.name]: Number(e.target.value) } });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const { data } = await profileApi.update(form);
      setForm(data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header"><h2>Profile</h2></div>
      <form className="glass-card" style={{ padding: 28, maxWidth: 720 }} onSubmit={onSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" name="fullName" value={form.fullName || ""} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" name="title" value={form.title || ""} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Tagline</label>
          <input className="form-control" name="tagline" value={form.tagline || ""} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea className="form-control" name="bio" rows={4} value={form.bio || ""} onChange={onChange} />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" name="email" value={form.email || ""} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="form-control" name="phone" value={form.phone || ""} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input className="form-control" name="location" value={form.location || ""} onChange={onChange} />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Profile Image</label>
            <ImageUpload
              value={form.profileImage}
              onChange={(url) => setForm({ ...form, profileImage: url })}
              accept="image"
              label="Profile Image"
            />
          </div>
          <div className="form-group">
            <label>Hero Image</label>
            <ImageUpload
              value={form.heroImage}
              onChange={(url) => setForm({ ...form, heroImage: url })}
              accept="image"
              label="Hero Image"
            />
          </div>
        </div>

        <h4 className="mt-3 mb-2">Stats</h4>
        <div className="grid grid-4">
          {Object.keys(form.stats || {}).map((key) => (
            <div className="form-group" key={key}>
              <label>{key}</label>
              <input className="form-control" type="number" name={key} value={form.stats[key]} onChange={onStatChange} />
            </div>
          ))}
        </div>

        {message && <p className={message.includes("success") ? "form-success" : "form-error"}>{message}</p>}
        <button className="btn btn-primary mt-2" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
      </form>
    </div>
  );
};

export default Profile;

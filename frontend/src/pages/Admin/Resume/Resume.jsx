import { useEffect, useState } from "react";
import { profileApi } from "../../../services/contentApi";
import Loading from "../../../components/Loading/Loading";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";

const Resume = () => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    profileApi.get().then(({ data }) => setProfile(data));
  }, []);

  if (!profile) return <Loading />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await profileApi.update(profile);
      setProfile(data);
      setMessage("Resume updated.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header"><h2>Resume</h2></div>
      <form className="glass-card" style={{ padding: 28, maxWidth: 520 }} onSubmit={onSubmit}>
        <div className="form-group">
          <label>Resume File (PDF)</label>
          <ImageUpload
            value={profile.resumeUrl}
            onChange={(url) => setProfile({ ...profile, resumeUrl: url })}
            accept="pdf"
            label="Resume"
          />
        </div>
        <p className="text-muted mb-2">
          Upload your PDF resume directly — it will power the "Download Resume" buttons across the site.
        </p>
        {message && <p className="form-success">{message}</p>}
        <button className="btn btn-primary mt-2" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
};

export default Resume;

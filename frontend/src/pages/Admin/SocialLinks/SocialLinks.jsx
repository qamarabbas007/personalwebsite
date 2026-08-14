import { useEffect, useState } from "react";
import { profileApi } from "../../../services/contentApi";
import Loading from "../../../components/Loading/Loading";

const platforms = ["github", "linkedin", "twitter", "instagram", "facebook", "whatsapp"];

const SocialLinks = () => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    profileApi.get().then(({ data }) => setProfile(data));
  }, []);

  if (!profile) return <Loading />;

  const onChange = (e) =>
    setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [e.target.name]: e.target.value } });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await profileApi.update(profile);
      setProfile(data);
      setMessage("Social links updated.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header"><h2>Social Links</h2></div>
      <form className="glass-card" style={{ padding: 28, maxWidth: 560 }} onSubmit={onSubmit}>
        {platforms.map((p) => (
          <div className="form-group" key={p}>
            <label style={{ textTransform: "capitalize" }}>{p}</label>
            <input className="form-control" name={p} value={profile.socialLinks?.[p] || ""} onChange={onChange} />
          </div>
        ))}
        {message && <p className="form-success">{message}</p>}
        <button className="btn btn-primary mt-2" disabled={saving}>{saving ? "Saving..." : "Save Links"}</button>
      </form>
    </div>
  );
};

export default SocialLinks;

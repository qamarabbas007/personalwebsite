import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { profileApi } from "../../services/contentApi";
import Loading from "../../components/Loading/Loading";
import { getFileUrl } from "../../utils/helpers";
import "./About.css";

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.get().then(({ data }) => setProfile(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage />;

  return (
    <main className="page-wrapper about-page">
      <div className="container">
        <div className="about-grid">
          <div className="about-image glass-card">
            {profile?.profileImage ? (
              <img src={getFileUrl(profile.profileImage)} alt={profile.fullName} />
            ) : (
              <div className="about-image-placeholder">{profile?.fullName?.charAt(0) || "Q"}</div>
            )}
          </div>

          <div>
            <span className="eyebrow" style={{ display: "inline-block", marginBottom: 16 }}>About Me</span>
            <h1>
              I'm <span className="gradient-text">{profile?.fullName || "Qamar Abbas"}</span>
            </h1>
            <p className="text-muted mt-3">
              {profile?.bio ||
                "A passionate MERN Stack Developer focused on building performant, user-friendly web applications from concept to deployment."}
            </p>

            <div className="about-info-grid mt-4">
              <div><span className="text-muted">Email</span><p>{profile?.email || "—"}</p></div>
              <div><span className="text-muted">Phone</span><p>{profile?.phone || "—"}</p></div>
              <div><span className="text-muted">Location</span><p>{profile?.location || "—"}</p></div>
              <div><span className="text-muted">Availability</span><p>Open to freelance work</p></div>
            </div>

            {profile?.resumeUrl && (
              <a href={getFileUrl(profile.resumeUrl)} target="_blank" rel="noreferrer" className="btn btn-primary mt-4">
                <FiDownload /> Download Resume
              </a>
            )}
          </div>
        </div>

        {profile?.education?.length > 0 && (
          <div className="section">
            <div className="section-heading">
              <span className="eyebrow">Background</span>
              <h2>Education & Training</h2>
            </div>
            <div className="grid grid-2">
              {profile.education.map((edu, i) => (
                <div key={i} className="glass-card" style={{ padding: 24 }}>
                  <h3>{edu.degree}</h3>
                  <p className="text-muted mt-1">{edu.institute}</p>
                  <span className="badge mt-2">{edu.startYear} – {edu.endYear}</span>
                  {edu.description && <p className="text-muted mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default About;

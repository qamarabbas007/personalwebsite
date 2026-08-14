import { Link } from "react-router-dom";
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { getFileUrl } from "../../../utils/helpers";

const Hero = ({ profile }) => (
  <section className="hero">
    <div className="container hero-inner">
      <div className="hero-text fade-in-up">
        <span className="section-heading eyebrow" style={{ marginBottom: 20 }}>Available for freelance work</span>
        <h1>
          Hi, I'm <span className="gradient-text">{profile?.fullName || "Qamar Abbas"}</span>
          <br />
          {profile?.title || "MERN Stack Developer"}
        </h1>
        <p className="text-muted mt-3 hero-tagline">
          {profile?.tagline ||
            "I design and build fast, scalable full-stack web applications using MongoDB, Express, React and Node.js."}
        </p>
        <div className="hero-actions mt-4">
          <Link to="/contact" className="btn btn-primary">
            Hire Me <FiArrowRight />
          </Link>
          {profile?.resumeUrl && (
            <a href={getFileUrl(profile.resumeUrl)} className="btn btn-outline" target="_blank" rel="noreferrer">
              <FiDownload /> Resume
            </a>
          )}
        </div>
        <div className="hero-social mt-4">
          <a href={profile?.socialLinks?.github || "#"} aria-label="GitHub"><FiGithub /></a>
          <a href={profile?.socialLinks?.linkedin || "#"} aria-label="LinkedIn"><FiLinkedin /></a>
          <a href={profile?.socialLinks?.twitter || "#"} aria-label="Twitter"><FiTwitter /></a>
        </div>
      </div>

      <div className="hero-visual fade-in-up">
        <div className="hero-image-wrap glass-card">
          {profile?.heroImage ? (
            <img src={getFileUrl(profile.heroImage)} alt={profile?.fullName} />
          ) : (
            <div className="hero-image-placeholder">MERN</div>
          )}
        </div>
        <div className="hero-badge badge-1">React</div>
        <div className="hero-badge badge-2">Node.js</div>
        <div className="hero-badge badge-3">MongoDB</div>
        <div className="hero-badge badge-4">Express</div>
      </div>
    </div>
  </section>
);

export default Hero;

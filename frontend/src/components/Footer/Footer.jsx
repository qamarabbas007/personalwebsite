import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram } from "react-icons/fi";
import { NAV_LINKS } from "../../utils/constants";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <Link to="/" className="navbar-logo">
          <span className="gradient-text">Qamar</span>Abbas
        </Link>
        <p className="text-muted mt-2">
          MERN Stack Developer crafting fast, scalable web applications for startups and
          businesses worldwide.
        </p>
        <div className="footer-social">
          <a href="#" aria-label="GitHub"><FiGithub /></a>
          <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
          <a href="#" aria-label="Twitter"><FiTwitter /></a>
          <a href="#" aria-label="Instagram"><FiInstagram /></a>
        </div>
      </div>

      <div className="footer-links">
        <h4>Quick Links</h4>
        {NAV_LINKS.slice(0, 6).map((l) => (
          <Link key={l.path} to={l.path}>{l.label}</Link>
        ))}
      </div>

      <div className="footer-links">
        <h4>Get In Touch</h4>
        <p className="text-muted">Available for freelance MERN stack projects.</p>
        <Link to="/contact" className="btn btn-outline btn-sm mt-2">Start a Project</Link>
      </div>
    </div>

    <div className="footer-bottom">
      <p className="text-muted">© {new Date().getFullYear()} Qamar Abbas. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;

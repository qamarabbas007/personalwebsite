import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const ContactCTA = () => (
  <section className="section">
    <div className="container">
      <div className="glass-card cta-card">
        <h2>Have a project in mind?</h2>
        <p className="text-muted mt-2">
          Let's build something great together — from MVPs to full production platforms.
        </p>
        <Link to="/contact" className="btn btn-primary mt-3">
          Start a Project <FiArrowRight />
        </Link>
      </div>
    </div>
  </section>
);

export default ContactCTA;

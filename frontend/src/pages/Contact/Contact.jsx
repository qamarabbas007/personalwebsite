import { useState } from "react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { sendContactMessage } from "../../services/messageApi";
import { validateContactForm } from "../../utils/validation";
import "./Contact.css";

const initialForm = { name: "", email: "", subject: "", projectType: "", budget: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const validation = validateContactForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus({ loading: true, success: false, error: "" });
    try {
      await sendContactMessage(form);
      setStatus({ loading: false, success: true, error: "" });
      setForm(initialForm);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Get In Touch</span>
          <h1>Let's Work Together</h1>
          <p>Tell me about your project and I'll get back to you within 24 hours.</p>
        </div>

        <div className="contact-grid">
          <div className="glass-card contact-info">
            <div className="contact-info-item">
              <FiMail /> <span>qamarabbassi761@gmail.com</span>
            </div>
            <div className="contact-info-item">
              <FiPhone /> <span>+92 3446498761</span>
            </div>
            <div className="contact-info-item">
              <FiMapPin /> <span>Karachi, Pakistan</span>
            </div>
          </div>

          <form className="glass-card contact-form" onSubmit={onSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Name</label>
                <input className="form-control" name="name" value={form.name} onChange={onChange} />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className="form-control" name="email" value={form.email} onChange={onChange} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>Project Type</label>
                <select className="form-control"  name="projectType" value={form.projectType} onChange={onChange}>
                  <option value="">Select type</option>
                  <option>Web Application</option>
                  <option>API Development</option>
                  <option>Admin Dashboard</option>
                  <option>E-commerce</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input className="form-control" name="budget" placeholder="e.g. $500 - $1500" value={form.budget} onChange={onChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input className="form-control" name="subject" value={form.subject} onChange={onChange} />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea className="form-control" name="message" rows={5} value={form.message} onChange={onChange} />
              {errors.message && <p className="form-error">{errors.message}</p>}
            </div>

            {status.error && <p className="form-error">{status.error}</p>}
            {status.success && <p className="form-success">Thanks! Your message has been sent — I'll be in touch soon.</p>}

            <button className="btn btn-primary btn-block mt-2" disabled={status.loading}>
              {status.loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;

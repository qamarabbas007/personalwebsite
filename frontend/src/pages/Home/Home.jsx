import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import ContactCTA from "./sections/ContactCTA";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import TestimonialCard from "../../components/TestimonialCard/TestimonialCard";
import Loading from "../../components/Loading/Loading";
import { profileApi } from "../../services/contentApi";
import { getProjects } from "../../services/projectApi";
import { servicesApi, testimonialsApi } from "../../services/contentApi";
import "./Home.css";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      profileApi.get(),
      getProjects({ featured: true, limit: 3 }),
      servicesApi.getAll({ limit: 3 }),
      testimonialsApi.getAll({ limit: 3 }),
    ]).then(([p, pr, s, t]) => {
      if (p.status === "fulfilled") setProfile(p.value.data);
      if (pr.status === "fulfilled") setProjects(pr.value.data);
      if (s.status === "fulfilled") setServices(s.value.data);
      if (t.status === "fulfilled") setTestimonials(t.value.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading fullPage />;

  return (
    <main>
      <Hero profile={profile} />
      <Stats stats={profile?.stats} />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Featured Work</span>
            <h2>Recent Projects</h2>
            <p>A selection of full-stack applications built with the MERN stack.</p>
          </div>
          <div className="grid grid-3">
            {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
          <div className="text-center mt-4">
            <Link to="/projects" className="btn btn-outline">View All Projects</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">What I Offer</span>
            <h2>Services</h2>
            <p>End-to-end development services for startups and businesses.</p>
          </div>
          <div className="grid grid-3">
            {services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Client Feedback</span>
              <h2>Testimonials</h2>
            </div>
            <div className="grid grid-3">
              {testimonials.map((t) => <TestimonialCard key={t._id} testimonial={t} />)}
            </div>
          </div>
        </section>
      )}

      <ContactCTA />
    </main>
  );
};

export default Home;

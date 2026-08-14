import { useEffect, useState } from "react";
import { servicesApi } from "../../services/contentApi";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router-dom";
import "./Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesApi.getAll({ active: true, limit: 100 }).then(({ data }) => setServices(data)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Services</span>
          <h1>What I Can Build For You</h1>
          <p>From landing pages to full production MERN platforms with authentication, dashboards and real-time features.</p>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-3">
            {services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/contact" className="btn btn-primary">Get a Free Quote</Link>
        </div>
      </div>
    </main>
  );
};

export default Services;

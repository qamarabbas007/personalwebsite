import { useEffect, useState } from "react";
import { testimonialsApi } from "../../services/contentApi";
import TestimonialCard from "../../components/TestimonialCard/TestimonialCard";
import Loading from "../../components/Loading/Loading";
import "./Testimonials.css";

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialsApi.getAll({ approved: true, limit: 100 }).then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Client Feedback</span>
          <h1>What Clients Say</h1>
          <p>Reviews from clients I've built products for.</p>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-3">
            {items.map((t) => <TestimonialCard key={t._id} testimonial={t} />)}
            {items.length === 0 && <p className="text-muted">No testimonials yet.</p>}
          </div>
        )}
      </div>
    </main>
  );
};

export default Testimonials;

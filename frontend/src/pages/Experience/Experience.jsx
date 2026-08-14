import { useEffect, useState } from "react";
import { experienceApi } from "../../services/contentApi";
import Loading from "../../components/Loading/Loading";
import { formatDate } from "../../utils/helpers";
import "./Experience.css";

const Experience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experienceApi.getAll({ limit: 100, sort: "-startDate" }).then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Journey</span>
          <h1>Experience & Education</h1>
          <p>Education, training and professional/freelance milestones along the way.</p>
        </div>

        {loading ? <Loading /> : (
          <div className="timeline">
            {items.map((item) => (
              <div key={item._id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="glass-card timeline-card">
                  <span className="badge">{item.type}</span>
                  <h3 className="mt-2">{item.title}</h3>
                  <p className="text-muted">{item.organization} {item.location && `· ${item.location}`}</p>
                  <p className="text-muted" style={{ fontSize: "0.82rem" }}>
                    {formatDate(item.startDate)} — {item.isCurrent ? "Present" : item.endDate ? formatDate(item.endDate) : ""}
                  </p>
                  {item.description && <p className="mt-2">{item.description}</p>}
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-muted">Experience timeline coming soon.</p>}
          </div>
        )}
      </div>
    </main>
  );
};

export default Experience;

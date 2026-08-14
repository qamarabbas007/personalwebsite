import { useEffect, useState } from "react";
import { getProjects } from "../../services/projectApi";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Loading from "../../components/Loading/Loading";
import { PROJECT_CATEGORIES } from "../../utils/constants";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (search) params.search = search;
    if (category !== "All") params.category = category;

    const timeout = setTimeout(() => {
      getProjects(params).then(({ data }) => setProjects(data)).finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Portfolio</span>
          <h1>Projects</h1>
          <p>A collection of MERN stack applications — from client platforms to internal tools.</p>
        </div>

        <div className="projects-toolbar">
          <input
            className="form-control"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="projects-filters">
            {["All", ...PROJECT_CATEGORIES].map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-outline"}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-3 mt-3">
            {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
            {projects.length === 0 && <p className="text-muted">No projects match your filters.</p>}
          </div>
        )}
      </div>
    </main>
  );
};

export default Projects;

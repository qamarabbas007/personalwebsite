import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiExternalLink, FiGithub, FiArrowLeft } from "react-icons/fi";
import { getProjectBySlug } from "../../services/projectApi";
import Loading from "../../components/Loading/Loading";
import { getFileUrl } from "../../utils/helpers";

const ProjectDetails = () => {
  const { id: slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProjectBySlug(slug)
      .then(({ data }) => setProject(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading fullPage />;
  if (error || !project) return (
    <main className="page-wrapper container text-center">
      <p className="text-muted">{error || "Project not found."}</p>
      <Link to="/projects" className="btn btn-outline mt-3">Back to Projects</Link>
    </main>
  );

  return (
    <main className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/projects" className="btn btn-outline btn-sm mb-3"><FiArrowLeft /> All Projects</Link>

        {project.thumbnail && (
          <div className="glass-card" style={{ overflow: "hidden", marginBottom: 32 }}>
            <img src={getFileUrl(project.thumbnail)} alt={project.title} style={{ width: "100%" }} />
          </div>
        )}

        <span className="badge">{project.category}</span>
        <h1 className="mt-2">{project.title}</h1>
        <p className="text-muted mt-2">{project.description}</p>

        <div className="flex gap-2 mt-3">
          {project.technologies?.map((t) => <span key={t} className="badge">{t}</span>)}
        </div>

        <div className="flex gap-2 mt-4">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
              <FiExternalLink /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
              <FiGithub /> Source Code
            </a>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProjectDetails;

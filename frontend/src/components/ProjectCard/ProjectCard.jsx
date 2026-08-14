import { Link } from "react-router-dom";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { getFileUrl } from "../../utils/helpers";
import "./ProjectCard.css";

const ProjectCard = ({ project }) => (
  <div className="project-card glass-card">
    <div className="project-thumb">
      {project.thumbnail ? (
        <img src={getFileUrl(project.thumbnail)} alt={project.title} />
      ) : (
        <div className="project-thumb-placeholder">{project.title?.charAt(0)}</div>
      )}
      <div className="project-overlay">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-icon-btn">
            <FiExternalLink />
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-icon-btn">
            <FiGithub />
          </a>
        )}
      </div>
    </div>
    <div className="project-body">
      <span className="badge">{project.category}</span>
      <h3 className="mt-2">{project.title}</h3>
      <p className="text-muted mt-1">{project.shortDescription || project.description}</p>
      <div className="project-tech">
        {project.technologies?.slice(0, 4).map((tech) => (
          <span key={tech} className="badge">{tech}</span>
        ))}
      </div>
      <Link to={`/projects/${project.slug}`} className="btn btn-outline btn-sm mt-3">
        View Details
      </Link>
    </div>
  </div>
);

export default ProjectCard;

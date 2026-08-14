import { getFileUrl } from "../../utils/helpers";
import "./SkillCard.css";

const SkillCard = ({ skill }) => (
  <div className="skill-card glass-card">
    <div className="skill-card-top">
      <div className="skill-icon">
        {skill.icon ? <img src={getFileUrl(skill.icon)} alt={skill.name} /> : skill.name?.charAt(0)}
      </div>
      <div>
        <h4>{skill.name}</h4>
        <span className="text-muted" style={{ fontSize: "0.8rem" }}>{skill.category}</span>
      </div>
    </div>
    <div className="skill-bar-track">
      <div className="skill-bar-fill" style={{ width: `${skill.percentage}%` }} />
    </div>
    <span className="skill-percentage">{skill.percentage}%</span>
  </div>
);

export default SkillCard;

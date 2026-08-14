import { useEffect, useState } from "react";
import { skillsApi } from "../../services/contentApi";
import SkillCard from "../../components/SkillCard/SkillCard";
import Loading from "../../components/Loading/Loading";
import { SKILL_CATEGORIES } from "../../utils/constants";
import "./Skills.css";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsApi.getAll({ limit: 100 }).then(({ data }) => setSkills(data)).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "All" ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">My Toolbox</span>
          <h1>Skills & Technologies</h1>
          <p>Technologies I use to design, build and ship full-stack applications.</p>
        </div>

        <div className="skills-filters">
          {["All", ...SKILL_CATEGORIES].map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${activeCategory === cat ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-3 mt-4">
            {filtered.map((skill) => <SkillCard key={skill._id} skill={skill} />)}
            {filtered.length === 0 && <p className="text-muted">No skills found in this category yet.</p>}
          </div>
        )}
      </div>
    </main>
  );
};

export default Skills;

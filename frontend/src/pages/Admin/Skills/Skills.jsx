import AdminCrudPage from "../shared/AdminCrudPage";
import { skillsApi } from "../../../services/contentApi";
import { SKILL_CATEGORIES } from "../../../utils/constants";

const fields = [
  { name: "name", label: "Skill Name", type: "text" },
  { name: "category", label: "Category", type: "select", options: SKILL_CATEGORIES },
  { name: "percentage", label: "Proficiency (%)", type: "number" },
  { name: "icon", label: "Icon", type: "image", column: false },
];

const AdminSkills = () => <AdminCrudPage title="Skills" api={skillsApi} fields={fields} />;
export default AdminSkills;

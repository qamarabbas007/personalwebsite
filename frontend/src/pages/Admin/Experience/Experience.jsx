import AdminCrudPage from "../shared/AdminCrudPage";
import { experienceApi } from "../../../services/contentApi";

const fields = [
  { name: "type", label: "Type", type: "select", options: ["Education", "Training", "Freelance", "Job", "Project"] },
  { name: "title", label: "Title", type: "text" },
  { name: "organization", label: "Organization", type: "text" },
  { name: "startDate", label: "Start Date", type: "text" },
  { name: "endDate", label: "End Date", type: "text" },
  { name: "description", label: "Description", type: "textarea", column: false },
];

const AdminExperience = () => <AdminCrudPage title="Experience" api={experienceApi} fields={fields} />;
export default AdminExperience;

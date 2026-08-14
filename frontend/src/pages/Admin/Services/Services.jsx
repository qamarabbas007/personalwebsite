import AdminCrudPage from "../shared/AdminCrudPage";
import { servicesApi } from "../../../services/contentApi";

const fields = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "startingPrice", label: "Starting Price", type: "text" },
  { name: "icon", label: "Icon", type: "image", column: false },
];

const AdminServices = () => <AdminCrudPage title="Services" api={servicesApi} fields={fields} />;
export default AdminServices;

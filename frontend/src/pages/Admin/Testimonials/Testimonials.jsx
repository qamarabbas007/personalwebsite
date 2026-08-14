import AdminCrudPage from "../shared/AdminCrudPage";
import { testimonialsApi } from "../../../services/contentApi";

const fields = [
  { name: "clientName", label: "Client Name", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "rating", label: "Rating (1-5)", type: "number" },
  { name: "review", label: "Review", type: "textarea", column: false },
  { name: "image", label: "Client Photo", type: "image", column: false },
];

const AdminTestimonials = () => <AdminCrudPage title="Testimonials" api={testimonialsApi} fields={fields} />;
export default AdminTestimonials;

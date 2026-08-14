import { getFileUrl } from "../../utils/helpers";
import "./ServiceCard.css";

const ServiceCard = ({ service }) => (
  <div className="service-card glass-card">
    <div className="service-icon">{service.icon ? <img src={getFileUrl(service.icon)} alt="" /> : "⚙️"}</div>
    <h3 className="mt-2">{service.title}</h3>
    <p className="text-muted mt-1">{service.description}</p>
    {service.startingPrice && (
      <p className="service-price mt-2">Starting at {service.startingPrice}</p>
    )}
  </div>
);

export default ServiceCard;

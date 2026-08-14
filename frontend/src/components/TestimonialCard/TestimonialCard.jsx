import { FiStar } from "react-icons/fi";
import { getFileUrl } from "../../utils/helpers";
import "./TestimonialCard.css";

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card glass-card">
    <div className="testimonial-rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar key={i} className={i < testimonial.rating ? "star-filled" : "star-empty"} />
      ))}
    </div>
    <p className="testimonial-review mt-2">"{testimonial.review}"</p>
    <div className="testimonial-client mt-3">
      <div className="testimonial-avatar">
        {testimonial.image ? (
          <img src={getFileUrl(testimonial.image)} alt={testimonial.clientName} />
        ) : (
          testimonial.clientName?.charAt(0)
        )}
      </div>
      <div>
        <h4>{testimonial.clientName}</h4>
        <span className="text-muted" style={{ fontSize: "0.8rem" }}>
          {testimonial.position} {testimonial.company && `@ ${testimonial.company}`}
        </span>
      </div>
    </div>
  </div>
);

export default TestimonialCard;

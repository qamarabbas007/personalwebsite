import { classNames } from "../../utils/helpers";
import "./Button.css";

const Button = ({
  children,
  variant = "primary", // primary | outline | danger
  size = "md", // md | sm
  block = false,
  loading = false,
  type = "button",
  className = "",
  ...rest
}) => (
  <button
    type={type}
    className={classNames(
      "btn",
      variant === "outline" && "btn-outline",
      variant === "danger" && "btn-danger",
      variant === "primary" && "btn-primary",
      size === "sm" && "btn-sm",
      block && "btn-block",
      className
    )}
    disabled={loading || rest.disabled}
    {...rest}
  >
    {loading ? "Please wait…" : children}
  </button>
);

export default Button;

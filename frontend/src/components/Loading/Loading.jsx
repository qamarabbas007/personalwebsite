import "./Loading.css";

const Loading = ({ fullPage = false, label = "Loading..." }) => (
  <div className={`loading-wrap ${fullPage ? "loading-full" : ""}`}>
    <div className="spinner" />
    {label && <p className="text-muted mt-2">{label}</p>}
  </div>
);

export default Loading;

import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { NAV_LINKS } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <span className="gradient-text">Qamar</span>Abbas
        </Link>

        <nav className={`navbar-links ${open ? "navbar-links-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) => `navbar-link ${isActive ? "navbar-link-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="navbar-mobile-actions">
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : "/chat"} className="btn btn-primary btn-sm">
                {user.role === "admin" ? "Dashboard" : "My Chat"}
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          {user ? (
            <Link to={user.role === "admin" ? "/admin" : "/chat"} className="btn btn-primary btn-sm">
              {user.role === "admin" ? "Dashboard" : "My Chat"}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;

import { NavLink, Outlet } from "react-router-dom";
import { FiLogOut, FiBell } from "react-icons/fi";
import { ADMIN_NAV_LINKS } from "../../../utils/constants";
import useAuth from "../../../hooks/useAuth";
import "./AdminLayout.css";

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="gradient-text">Qamar</span>Admin
        </div>
        <nav className="admin-nav">
          {ADMIN_NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link-active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar-actions">
            <button className="admin-icon-btn" aria-label="Notifications"><FiBell /></button>
            <span className="text-muted">{user?.name}</span>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

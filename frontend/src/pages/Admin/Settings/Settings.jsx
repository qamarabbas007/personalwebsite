import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

// Placeholder settings page: admin account details + theme note.
// Extend with password-change / notification-preference endpoints as needed.
const Settings = () => {
  const { user } = useAuth();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyChat, setNotifyChat] = useState(true);

  return (
    <div>
      <div className="admin-page-header"><h2>Settings</h2></div>

      <div className="glass-card" style={{ padding: 28, maxWidth: 560 }}>
        <h4 className="mb-2">Account</h4>
        <p className="text-muted">Name</p>
        <p className="mb-2">{user?.name}</p>
        <p className="text-muted">Email</p>
        <p className="mb-3">{user?.email}</p>

        <h4 className="mb-2 mt-3">Notification Preferences</h4>
        <label className="flex gap-1 mb-2">
          <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
          Email me about new project requests
        </label>
        <label className="flex gap-1">
          <input type="checkbox" checked={notifyChat} onChange={(e) => setNotifyChat(e.target.checked)} />
          Show badge for new chat messages
        </label>

        <p className="text-muted mt-3" style={{ fontSize: "0.8rem" }}>
          These preferences are UI-only in this scaffold — wire them to a
          <code> /api/profile</code> or dedicated settings endpoint to persist them.
        </p>
      </div>
    </div>
  );
};

export default Settings;

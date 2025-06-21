import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Save } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function Account() {
  const [user, setUser] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const userRes = await axios.get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projectRes = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);
      setNewName(userRes.data.name);
      setProjectCount(projectRes.data.length);
    } catch (err) {
      console.error("Failed to load account info", err);
    }
  };

  const deleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/api/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      navigate("/register");
    } catch (err) {
      console.error("Error deleting account", err.response?.data || err.message);
      alert("❌ Failed to delete account.");
    }
  };

  const updateUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/api/users/update`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditing(false);
      fetchData();
    } catch (err) {
      console.error("Failed to update username", err);
      alert("❌ Could not update username.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!user) return <div className="p-6 text-white">Loading...</div>;

  const creationDate =
    user.createdAt && !isNaN(Date.parse(user.createdAt))
      ? new Date(user.createdAt).toLocaleDateString()
      : "Unknown";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-start">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center mb-4">👤 My Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={updateUsername}
                  className="bg-blue-600 hover:bg-blue-700 px-3 rounded text-white"
                >
                  <Save size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-lg">{user.name}</span>
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <Pencil size={18} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Projects Created</label>
            <p className="text-lg">{projectCount}</p>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Account Created</label>
            <p className="text-lg">{creationDate}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700">
          <button
            onClick={deleteAccount}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white flex justify-center items-center gap-2"
          >
            <Trash2 size={18} />
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { User, Users, Trash2, LogOut } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function TeamManagement() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const fetchTeam = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeamMembers(res.data.teamMembers || []);

      const profile = await axios.get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = profile.data._id;
      setCurrentUserId(userId);

      const ownerStatus = res.data.teamMembers.some(
        (tm) => tm?.user?._id === userId && tm.role === "Owner"
      );
      setIsOwner(ownerStatus);
    } catch (err) {
      console.error("Error fetching team:", err.message);
      setMessage("❌ Could not load team.");
    }
  }, [projectId]);

  const inviteUser = async () => {
    if (!identifier) return setMessage("⚠️ Please enter an email or username.");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/api/projects/${projectId}/invite`,
        { identifier },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ User invited!");
      setIdentifier("");
      fetchTeam();
    } catch (err) {
      console.error("Error inviting:", err.response?.data || err.message);
      setMessage("❌ Failed to invite user.");
    }
  };

  const removeUser = async (userIdToRemove) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API}/api/projects/${projectId}/remove/${userIdToRemove}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (userIdToRemove === currentUserId) {
        navigate("/dashboard");
      } else {
        setMessage("✅ User removed.");
        fetchTeam();
      }
    } catch (err) {
      console.error("Remove error:", err.response?.data || err.message);
      setMessage("❌ Could not remove user.");
    }
  };

  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("❌ Failed to delete project.");
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-blue-700 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" /> Team Management
          </h1>
          <p className="text-slate-200 text-sm mt-1">
            Manage your collaborators, assign roles, and invite new members.
          </p>
        </div>

        {/* Invite Form */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
            <input
              type="text"
              className="flex-1 bg-slate-800 border border-slate-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <button
              onClick={inviteUser}
              disabled={!isOwner}
              className={`px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition ${
                !isOwner ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Invite
            </button>
          </div>
          {message && <div className="text-blue-400">{message}</div>}
        </div>

        {/* Team List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-700 pb-1">
            Team Members
          </h2>
          {teamMembers.length === 0 ? (
            <p className="text-slate-400">No team members yet.</p>
          ) : (
            teamMembers.map((tm, idx) => {
              if (!tm?.user) return null;
              return (
                <div
                  key={tm.user._id || idx}
                  className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-2 rounded-full">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{tm.user.name}</p>
                      <p className="text-slate-400 text-sm">{tm.user.email}</p>
                      <p className="text-xs italic text-slate-500">{tm.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner && tm.role !== "Owner" && tm.user._id !== currentUserId && (
                      <button
                        onClick={() => removeUser(tm.user._id)}
                        className="text-red-500 hover:underline flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    )}
                    {tm.user._id === currentUserId && tm.role !== "Owner" && (
                      <button
                        onClick={() => removeUser(tm.user._id)}
                        className="text-orange-400 hover:underline flex items-center gap-1 text-sm"
                      >
                        <LogOut className="w-4 h-4" /> Leave Project
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Danger Zone */}
        {isOwner && (
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
            <button
              onClick={deleteProject}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamManagement;

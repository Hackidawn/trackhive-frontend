import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = await axios.get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUserId(profile.data._id);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("❌ Failed to delete project", err.response?.data || err.message);
      alert("Failed to delete project.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white px-6 py-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold mb-1">👋 Welcome to TrackHive</h1>
            <p className="text-slate-400 text-sm">Your smart space to manage and explore projects.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/account")}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded shadow-sm"
            >
              My Account
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">📁 Your Projects</h2>
          <button
            onClick={() => navigate("/create-project")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 px-5 py-2 rounded-full font-medium shadow-lg"
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-slate-400 mt-12">No projects found. Click “New Project” to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const isOwner = project.teamMembers.some(
                (tm) => tm.user?._id === currentUserId && tm.role === "Owner"
              );

              return (
                <div
                  key={project._id}
                  className="bg-slate-800 bg-opacity-90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 relative hover:scale-[1.02] transition-transform duration-300 shadow-md hover:shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-blue-400">{project.title}</h3>
                    <span className="text-xs text-slate-400">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown"}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-4 line-clamp-3">{project.description}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/project/${project._id}`)}
                      className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      🔍 View
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

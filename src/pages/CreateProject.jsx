import React, { useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const createProject = async () => {
    if (!title || !description) {
      setFeedback("⚠️ Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/api/projects`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback("✅ Project created!");
      setTitle("");
      setDescription("");
    } catch (err) {
      setFeedback("❌ Error creating project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-slate-900 p-8 rounded-lg shadow-xl w-full max-w-xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          <Plus className="inline-block w-5 h-5 mr-2 text-green-400" />
          Create a New Project
        </h2>

        <div className="space-y-4">
          <input
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-3 h-32 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={createProject}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>

          {feedback && (
            <div className="text-sm text-center text-slate-300 mt-2">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateProject;

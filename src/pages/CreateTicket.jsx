import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function CreateTicket() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");
  const [assignee, setAssignee] = useState("");
  const [users, setUsers] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.teamMembers || []);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };

    if (projectId) fetchUsers();
  }, [projectId]);

  const createTicket = async () => {
    if (!title || !description) {
      setShowToast("Please fill in title and description.");
      return;
    }

    const token = localStorage.getItem("token");

    const payload = {
      title,
      description,
      priority,
      status,
      projectId,
      assignee: assignee || null,
    };

    try {
      await axios.post(`${API}/api/tickets`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowToast("✅ Ticket created successfully!");

      setTimeout(() => {
        setShowToast(false);
        navigate(`/board/${projectId}`);
      }, 2000);
    } catch (err) {
      console.error("❌ Error creating ticket:", err.response?.data || err.message);
      setShowToast("❌ Failed to create ticket.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="bg-slate-900/90 backdrop-blur-lg rounded-xl shadow-xl p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-white mb-6">🎫 Create New Ticket</h2>

        <div className="space-y-4">
          <input
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 resize-none"
            placeholder="Description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>

          <select
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To Do">📝 To Do</option>
            <option value="In Progress">🚧 In Progress</option>
            <option value="Done">✅ Done</option>
          </select>

          <select
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">🙅‍♂️ Unassigned</option>
            {users
              .filter((tm) => tm?.user)
              .map((tm) => (
                <option key={tm.user._id} value={tm.user._id}>
                  👤 {tm.user.name} ({tm.user.email})
                </option>
              ))}
          </select>
        </div>

        <button
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
          onClick={createTicket}
        >
          🚀 Create Ticket
        </button>

        {showToast && (
          <div className="mt-4 bg-slate-800 text-white px-4 py-2 rounded shadow text-sm text-center border border-slate-600">
            {showToast}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateTicket;

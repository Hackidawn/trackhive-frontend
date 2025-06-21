import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function FilterSearch() {
  const { projectId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const fetchFiltered = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/api/tickets/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let filtered = res.data;
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (keyword) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setTickets(filtered);
  } catch (err) {
    console.error("❌ Error fetching filtered tickets:", err.response?.data || err.message);
  }
}, [keyword, status, projectId]);

useEffect(() => {
  if (projectId) fetchFiltered();
}, [fetchFiltered]);


  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">🔍 Search & Filter Tickets</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title..."
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative w-full sm:w-1/3">
          <Filter className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
          <select
            onChange={(e) => setStatus(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center text-slate-400">No tickets match the filters.</div>
      ) : (
        <ul className="space-y-4">
          {tickets.map((t) => (
            <li
              key={t._id}
              className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-slate-500 transition"
            >
              <h3 className="text-lg font-semibold text-white">{t.title}</h3>
              <p className="text-sm text-slate-400 mt-1">Status: {t.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterSearch;

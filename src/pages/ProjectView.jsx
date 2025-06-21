import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FolderKanban,
  PlusCircle,
  Users,
  Search,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function ProjectView() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project", err);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-lg">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto bg-slate-900/80 border border-slate-700 backdrop-blur-lg rounded-xl shadow-2xl p-8">
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            {project.title}
          </h1>
          <p className="text-slate-300 text-lg">{project.description}</p>
        </header>

        <hr className="border-slate-700 mb-6" />

        <section>
          <h2 className="text-xl font-semibold mb-4">Project Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <ActionCard
              label="Kanban Board"
              description="Manage workflow visually"
              icon={<FolderKanban className="w-5 h-5 mr-2" />}
              color="bg-purple-600"
              onClick={() => navigate(`/board/${projectId}`)}
            />

            <ActionCard
              label="Create Ticket"
              description="Add a new task"
              icon={<PlusCircle className="w-5 h-5 mr-2" />}
              color="bg-green-600"
              onClick={() => navigate(`/create-ticket/${projectId}`)}
            />

            <ActionCard
              label="Manage Team"
              description="Invite or update members"
              icon={<Users className="w-5 h-5 mr-2" />}
              color="bg-yellow-500"
              onClick={() => navigate(`/project/${projectId}/team`)}
            />

            <ActionCard
              label="Search"
              description="Find issues or tickets"
              icon={<Search className="w-5 h-5 mr-2" />}
              color="bg-slate-700"
              onClick={() => navigate(`/search/${projectId}`)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ActionCard({ label, description, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${color} hover:brightness-110 transition p-5 rounded-lg shadow-lg flex flex-col justify-between space-y-2 border border-slate-700`}
    >
      <div className="flex items-center text-white font-semibold text-lg">
        {icon}
        {label}
      </div>
      <p className="text-sm text-slate-200">{description}</p>
    </div>
  );
}

export default ProjectView;

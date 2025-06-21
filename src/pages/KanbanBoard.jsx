import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../components/SortableItem";
import { useParams } from "react-router-dom";
import DroppableColumn from "../components/DroppableColumn";
import CommentBox from "../components/CommentBox";

const API = import.meta.env.VITE_API_URL;

function KanbanBoard() {
  const { projectId } = useParams();
  const [columns, setColumns] = useState({
    "To Do": [],
    "In Progress": [],
    "Done": [],
  });

  const sensors = useSensors(useSensor(PointerSensor));
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/tickets/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const grouped = { "To Do": [], "In Progress": [], "Done": [] };
      res.data.forEach((t) => grouped[t.status]?.push(t));
      setColumns(grouped);
    } catch (err) {
      console.error("Error loading tickets:", err.message);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) fetchTickets();
  }, [projectId, fetchTickets]);

  const handleDragStart = () => {
    // No-op for now
  };

  const findColumnContainingTicket = (id) =>
    Object.keys(columns).find((key) => columns[key].some((t) => t._id === id));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const fromColumn = findColumnContainingTicket(activeId);
    let toColumn = findColumnContainingTicket(overId);
    if (!toColumn && ["To Do", "In Progress", "Done"].includes(overId)) {
      toColumn = overId;
    }

    if (!fromColumn || !toColumn || fromColumn === toColumn) return;

    const ticket = columns[fromColumn].find((t) => t._id === activeId);
    if (!ticket) return;

    const newFrom = columns[fromColumn].filter((t) => t._id !== activeId);
    const newTo = [...columns[toColumn], { ...ticket, status: toColumn }];

    setColumns({ ...columns, [fromColumn]: newFrom, [toColumn]: newTo });

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/api/tickets/${ticket._id}`,
        { status: toColumn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("❌ Failed to update ticket:", err.message);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) {
      console.error("❌ Failed to delete ticket:", err.message);
    }
  };

  const handleToggleDescription = (ticketId) => {
    setExpandedTicketId((prev) => (prev === ticketId ? null : ticketId));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">
        🐝 TrackHive - KANBAN BOARD
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(columns).map(([status, tasks]) => (
            <DroppableColumn key={status} id={status}>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-lg flex flex-col h-full">
                <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">
                  {status}
                </h2>
                <SortableContext
                  items={tasks.map((t) => t._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks.length === 0 ? (
                    <div className="h-24 flex items-center justify-center text-gray-400 text-sm bg-slate-800 rounded-lg">
                      Drop tickets here
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task._id}>
                        <SortableItem
                          id={task._id}
                          title={task.title}
                          priority={task.priority}
                          assignee={task.assignee?.name || "Unassigned"}
                          onDelete={() => handleDelete(task._id)}
                        />
                        <div className="flex justify-between items-center mt-2">
                          {/* Toggle Description Button */}
                          <button
                            className="text-blue-500 hover:text-blue-300 text-sm"
                            onClick={() => handleToggleDescription(task._id)}
                          >
                            {expandedTicketId === task._id
                              ? "Hide Description"
                              : "Show Description"}
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        {/* Description & Comment Box */}
                        {expandedTicketId === task._id && (
                          <div className="mt-2 bg-slate-800 p-4 rounded-lg border border-slate-600 text-slate-300 space-y-4">
                            <p>{task.description}</p>
                            <CommentBox ticketId={task._id} />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </SortableContext>
              </div>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;

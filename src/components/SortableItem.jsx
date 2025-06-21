import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react"; // optional icon

export const SortableItem = ({
  id,
  title,
  priority,
  assignee,
  onDelete,
  task,
  isExpanded,
  onToggle,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const borderColor =
    priority === "High"
      ? "border-red-500"
      : priority === "Medium"
      ? "border-yellow-500"
      : "border-green-500";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onToggle}
      className={`border-l-4 ${borderColor} bg-slate-800 hover:bg-slate-700 transition-all text-white p-4 mb-3 rounded-lg shadow-md cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-base mb-1">{title}</h4>
          <p className="text-xs text-slate-400">
            Assigned to: <span className="italic">{assignee || "Unassigned"}</span>
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-400 hover:text-red-500 transition"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 text-sm text-slate-300 border-t border-slate-600 pt-2">
          <strong>Description:</strong> {task?.description || "No description provided."}
        </div>
      )}
    </div>
  );
};

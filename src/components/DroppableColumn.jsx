import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[150px] transition-colors p-4 rounded-lg border border-slate-700 bg-slate-900 ${
        isOver ? "ring-2 ring-blue-500" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default DroppableColumn;

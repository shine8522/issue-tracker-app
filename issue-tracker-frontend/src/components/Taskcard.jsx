// src/components/TaskCard.jsx
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./Taskcard.css";

const TaskCard = ({ task, index, columnId, onDeleteTask, darkMode, openModal }) => {
  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? "dragging" : ""} ${darkMode ? "dark-mode" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => openModal(task)} // click anywhere to open modal
        >
          <div className="task-header">
            <h3 className="task-title">{capitalize(task.title)}</h3>

            {/* Delete button separate to prevent accidental edits */}
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent modal from opening
                onDeleteTask(task._id, columnId);
              }}
              title="Delete Task"
            >
              ✖
            </button>
          </div>

          <div
            className="task-description"
            dangerouslySetInnerHTML={{ __html: task.description }}
          ></div>

          <div className="task-footer">
            <span className={`priority-badge priority-${task.priority}`}>
              {capitalize(task.priority)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;

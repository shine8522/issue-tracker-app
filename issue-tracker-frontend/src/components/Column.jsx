// src/components/Column.jsx
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./Taskcard";
import SkeletonLoader from "./skeletonLoader"; 
import "./Column.css";

const Column = ({ title, tasks, droppableId, openModal, onDeleteTask, isLoading, darkMode }) => {
  return (
    <section className={`column ${darkMode ? "dark-mode" : ""}`}>
      <h2 className="column-title">
        {title} <span className="task-count">({tasks?.length || 0})</span>
      </h2>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`task-list ${snapshot.isDraggingOver ? "drag-over" : ""} ${tasks?.length === 0 ? "empty-list" : ""}`}
          >
            {isLoading ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : tasks?.length === 0 ? (
              <p className="empty-message">No tasks yet.</p>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  columnId={droppableId}
                  onDeleteTask={onDeleteTask}
                  openModal={openModal} // ✅ pass modal
                  darkMode={darkMode}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
};

export default Column;

// src/pages/Board.jsx
import React, { useState, useEffect } from "react";
import Column from "../components/Column";
import TaskModal from "../components/TaskModeal";
import { DragDropContext } from "@hello-pangea/dnd";
import axios from "axios";
import { BASE_URL } from "../api";
import "./Board.css";

const Board = ({ tasks, setTasks, fetchTasks, darkMode }) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Open modal for edit or add
  const openModal = (task = null) => {
    setEditingTask(task); // null → add new task
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  // Drag & drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = [...tasks[source.droppableId]];
    const destCol = [...tasks[destination.droppableId]];
    const [moved] = sourceCol.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, moved);
      setTasks({ ...tasks, [source.droppableId]: sourceCol });
    } else {
      destCol.splice(destination.index, 0, moved);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      });

      try {
        await axios.put(`${BASE_URL}/${moved._id}`, {
          status: destination.droppableId,
        });
      } catch (err) {
        console.error("Error updating task status:", err);
        fetchTasks(); // rollback if fails
      }
    }
  };

  // Delete task
  const deleteTask = async (taskId, columnId) => {
  try {
    const token = localStorage.getItem("token"); 

    await axios.delete(`${BASE_URL}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task._id !== taskId),
    }));
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};


  // Save task from modal (create or update)
  const handleSave = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        const res = await axios.put(`${BASE_URL}/${editingTask._id}`, taskData);
        fetchTasks();
      } else {
        // Create new task
        const res = await axios.post(BASE_URL, taskData);
        fetchTasks();
      }
      closeModal();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {["todo", "inProgress", "done"].map((col) => {
            const displayName =
              col === "inProgress"
                ? "In Progress"
                : col.charAt(0).toUpperCase() + col.slice(1);
            return (
              <Column
                key={col}
                title={displayName}
                tasks={tasks[col]}
                droppableId={col}
                onDeleteTask={deleteTask}
                openModal={openModal} // Pass modal function
                darkMode={darkMode}
              />
            );
          })}
        </div>
      </DragDropContext>

      {/* TaskModal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        taskToEdit={editingTask}
        column={editingTask?.status || "todo"}
        darkMode={darkMode}
      />
    </>
  );
};

export default Board;

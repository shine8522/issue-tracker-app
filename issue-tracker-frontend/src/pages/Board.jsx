// src/pages/Board.jsx
import React from "react";
import Column from "../components/Column";
import { DragDropContext } from "@hello-pangea/dnd";
import axios from "axios";
import { BASE_URL } from "../api";
import "./Board.css";

const Board = ({ tasks, setTasks, fetchTasks, darkMode }) => {
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

  const deleteTask = async (taskId, columnId) => {
    try {
      await axios.delete(`${BASE_URL}/${taskId}`);
      setTasks((prev) => ({
        ...prev,
        [columnId]: prev[columnId].filter((task) => task._id !== taskId),
      }));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
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
              darkMode={darkMode}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Board;

// src/App.jsx
import React, { useState, useEffect } from "react";
import Board from "./pages/Board";
import Navbar from "./components/Navbar";
import TaskModal from "./components/TaskModeal";
import axios from "axios";
import { BASE_URL } from "./api";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState("todo");
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
console.log("all-tasks",tasks);
  // 🌐 Fetch tasks initially
  const fetchTasks = async () => {
    try {
      const res = await axios.get(BASE_URL);
      const fetchedTasks = { todo: [], inProgress: [], done: [] };
      res.data.forEach((task) => {
        const status = task.status || "todo";
        if (!fetchedTasks[status]) fetchedTasks[status] = [];
        fetchedTasks[status].push(task);
      });
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 💾 Save task handler (passed to modal)
  const handleSaveTask = async ({ title, description, priority,status }) => {
    if (!title.trim()) return alert("Title is required");
     console.log("in input of save function",title, priority, status);
    try {
      
      const res = await axios.post(BASE_URL, {
        title,
        description,
        priority: priority || "low",
        status: status,
      });
      setTasks((prev) => ({
        ...prev,
        [status]: [...(prev[status] || []), res.data],
      }));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  const openModal = (column = "todo") => {
    setModalColumn(column);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        openModal={openModal}
      />

      <Board
        darkMode={darkMode}
        tasks={tasks}
        setTasks={setTasks}
        fetchTasks={fetchTasks}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}  
        darkMode={darkMode}
        column={modalColumn}
      />
    </div>
  );
}

export default App;

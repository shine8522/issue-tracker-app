// src/App.jsx
import React, { useState, useEffect,useContext } from "react";
import Board from "./pages/Board";
import Navbar from "./components/Navbar";
import TaskModal from "./components/TaskModeal";
import axios from "axios";
import { BASE_URL } from "./api";
import "./App.css";
import { AuthContext } from "./AuthContext";
import AuthModal from "./components/AuthModal";
function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const [modalType, setModalType] = useState(null); // "todo", "login", "signup", or null
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const { user } = useContext(AuthContext);
 const clearTasks = () => {
  setTasks({ todo: [], inProgress: [], done: [] });
};

  // 🌐 Fetch tasks initially
  const fetchTasks = async () => {
    try {
       const res = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
  if (user?.token) {
    fetchTasks();
  }
}, [user?.token]);

  // 💾 Save task handler (passed to modal)
  const handleSaveTask = async ({ title, description, priority,status }) => {
    if (!title.trim()) return alert("Title is required");
    
    try {
      
      const res = await axios.post(BASE_URL, {
        title,
        description,
        priority: priority || "low",
        status: status || "todo",
      }, { headers: { Authorization: `Bearer ${user.token}` } }
    );
      setTasks((prev) => ({
        ...prev,
        [status]: [...(prev[status] || []), res.data],
      }));
      setModalType(null);
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

   const openModal = (type) => setModalType(type); // "todo", "login", "signup"
  const closeModal = () => setModalType(null);

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        openModal={openModal}
         clearTasks={clearTasks}
      />

   
        <Board
          darkMode={darkMode}
          tasks={tasks}
          setTasks={setTasks}
          fetchTasks={fetchTasks}
        />
      

       {/* Task Modal */}
      {modalType === "todo" && (
        <TaskModal
          isOpen={true}
          onClose={closeModal}
          onSave={handleSaveTask}
          darkMode={darkMode}
          column="todo"
        />
      )}
       {/* Auth Modal */}
      {(modalType === "login" || modalType === "signup") && (
        <AuthModal type={modalType} closeModal={closeModal} />
      )}
    </div>
  );
}

export default App;

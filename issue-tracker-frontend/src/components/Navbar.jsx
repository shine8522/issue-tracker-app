import React from "react";
import './Navbar.css';
const Navbar = ({ darkMode, toggleDarkMode, openModal  }) => {
  return (
    <nav className={`navbar ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="app-title">SmartTasker</h1>
      <div className="navbar-actions">
        <button className="add-task-main-btn" onClick={() => openModal("todo")}>
          + Add Task
        </button>
        <button className="theme-toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

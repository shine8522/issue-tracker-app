import React,{ useState } from "react";
import './Navbar.css';
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import LogoutModal from "./LogoutModal";
const Navbar = ({ darkMode, toggleDarkMode, openModal, clearTasks  }) => {
  const {user,logout}=useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = () => {
    logout();
     clearTasks();
    setShowLogoutModal(false);
  };
  return (
    <nav className={`navbar ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="app-title">SmartTasker</h1>
      <div className="navbar-actions">
      {user && (
          <button className="add-task-main-btn" onClick={() => openModal("todo")}>
            + Add Task
          </button>
        )}
        <button className="theme-toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

         {/* Auth buttons */}
        {!user ? (
          <>
            <button className="login-btn" onClick={() => openModal("login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => openModal("signup")}>
              Signup
            </button>
          </>
        ) : (
          <>
            <span className="user-name">  Welcome, {user.name}</span>
            <button className="logout-btn"  onClick={handleLogoutClick}>Logout</button>
          </>
        )}
      </div>
<LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />

    </nav>
  );
};

export default Navbar;

import React from "react";
import { FiLogOut } from "react-icons/fi"; // using react-icons for logout icon
import { AiOutlineExclamationCircle } from "react-icons/ai"; // warning icon
import "./LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
    >
      <div className="modal-content">
        <div className="modal-header">
          <AiOutlineExclamationCircle className="modal-icon" />
          <h2 id="logout-title">Confirm Logout</h2>
        </div>
        <p id="logout-desc">
              Logging out will end your current session. You will need to log in again to continue
        </p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            <FiLogOut style={{ marginRight: "8px" }} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

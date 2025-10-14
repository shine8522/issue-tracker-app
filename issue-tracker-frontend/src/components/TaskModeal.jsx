import React, { useState, useEffect } from "react";
import "./TaskModal.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const TaskModal = ({ isOpen, onClose, onSave, darkMode, column }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState(column || "todo");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setPriority("low");
      setStatus(column || "todo");
    }
  }, [isOpen, column]);

  const handleSave = () => {
    if (!title.trim()) return alert("Title is required");
    onSave({ title, description, priority, status });
  };

  if (!isOpen) return null;

  const priorityOptions = [
    { label: "Low", value: "low", color: "#10B981" },
    { label: "Medium", value: "medium", color: "#F59E0B" },
    { label: "High", value: "high", color: "#EF4444" },
  ];

  const statusOptions = [
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "inProgress" },
    { label: "Done", value: "done" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${darkMode ? "dark-mode" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="modal-title">Add New Task</h2>

        {/* Body */}
        <div className="modal-body">
          {/* Title input */}
          <div className="input-group">
            <label className="modal-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="modal-input"
              placeholder="Enter task title"
            />
          </div>

          {/* Description editor */}
          <div className="description-container">
            <label className="modal-label">Description</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Add detailed notes, steps, or updates..."
              className="modal-richtext"
            />
            <div className="char-count">{description.length}/300</div>
          </div>

          {/* Selectors */}
          <div className="selectors">
            <div className="selector-section">
              <label className="modal-label">Priority</label>
              <div className="priority-group">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPriority(opt.value)}
                    className={`priority-btn ${
                      priority === opt.value ? "active" : ""
                    }`}
                    style={{
                      borderColor: opt.color,
                      backgroundColor:
                        priority === opt.value ? opt.color : "transparent",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="selector-section">
              <label className="modal-label">Status</label>
              <div className="status-group">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`status-btn ${
                      status === opt.value ? "active" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn save-btn" onClick={handleSave}>
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

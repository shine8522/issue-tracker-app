// src/components/TaskModal.jsx
import React, { useState, useEffect } from "react";
import "./TaskModal.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Extension } from "@tiptap/core";

// Optional: input rule to auto convert '- ' into taskItem
const AutoTaskItem = Extension.create({
  name: "autoTaskItem",
  addInputRules() {
    return [
      {
        // When user types "- " at start of line
        find: /^-\s$/,
        handler: ({ state, range, match }) => {
          const { tr } = state;
          tr.delete(range.from, range.to);
          return tr.setBlockType(range.from, range.from, this.editor.schema.nodes.taskItem);
        },
      },
    ];
  },
});

const TaskModal = ({ isOpen, onClose, onSave, darkMode, column, taskToEdit }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState(column || "todo");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      AutoTaskItem,
    ],
    content: taskToEdit?.description || "",
  });

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setPriority(taskToEdit.priority);
        setStatus(taskToEdit.status);
        editor?.commands.setContent(taskToEdit.description || "");
      } else {
        setTitle("");
        setPriority("low");
        setStatus(column || "todo");
        editor?.commands.clearContent();
      }
    }
  }, [isOpen, column, taskToEdit, editor]);

  const handleSave = () => {
    if (!title.trim()) return alert("Title is required");
    onSave({
      title,
      description: editor?.getHTML() || "",
      priority,
      status,
    });
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
        <h2 className="modal-title">{taskToEdit ? "Edit Task" : "Add New Task"}</h2>

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
          <EditorContent editor={editor} className={`modal-editor ${darkMode ? "dark-mode" : ""}`} />
        </div>

        {/* Priority & Status selectors */}
        <div className="selectors">
          <div className="selector-section">
            <label className="modal-label">Priority</label>
            <div className="priority-group">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  className={`priority-btn ${priority === opt.value ? "active" : ""}`}
                  style={{
                    borderColor: opt.color,
                    backgroundColor: priority === opt.value ? opt.color : "transparent",
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
                  className={`status-btn ${status === opt.value ? "active" : ""}`}
                >
                  {opt.label}
                </button>
              ))}
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

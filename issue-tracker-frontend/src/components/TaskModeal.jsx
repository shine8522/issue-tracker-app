// src/components/TaskModal.jsx
import React, { useState, useEffect } from "react";
import "./TaskModal.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import axios from "axios";

const TaskModal = ({ isOpen, onClose, onSave, darkMode, column, taskToEdit }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState(column || "todo");
  const [loadingAI, setLoadingAI] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
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

// ✨ Generate subtasks with AI (array iteration version)
// ✨ Generate subtasks with AI (handles JSON-block style responses)
const handleAIGenerate = async () => {
  if (!title.trim()) return alert("Please enter a title first.");
  setLoadingAI(true);

  try {
    const { data } = await axios.post("https://taskforge-8buq.onrender.com/api/ai/subtasks", { title });

    if (data.subtasks?.length) {
      // Join all lines into a single string
      let text = data.subtasks.join("\n");

      // Remove markdown code fences
      text = text.replace(/```json|```/g, "").trim();

      // Find JSON array part
      const jsonMatch = text.match(/\[([\s\S]*?)\]/);
      let subtasks = [];

      if (jsonMatch) {
        const jsonArrayString = `[${jsonMatch[1]}]`
          // ensure commas between items if missing
          .replace(/"\s*"/g, '", "')
          .replace(/\n/g, "")
          .trim();

        try {
          subtasks = JSON.parse(jsonArrayString);
        } catch {
          console.error("Failed to parse JSON array, using fallback");
          // Fallback: split by period for sentences
          subtasks = jsonArrayString.split(/"\s*,\s*"/).map((s) => s.replace(/"/g, "").trim());
        }
      }

      // Convert to TipTap task list HTML
      const formatted = subtasks
        .map((task) => `<li data-type="taskItem" data-checked="false">${task}</li>`)
        .join("");

      const html = `<ul data-type="taskList">${formatted}</ul>`;
      editor?.commands.setContent(html);
    }
  } catch (err) {
    console.error("AI generation failed:", err);
    alert("Failed to generate subtasks. Please try again later.");
  } finally {
    setLoadingAI(false);
  }
};





  const handleSave = () => {
    if (!title.trim()) return alert("Title is required.");
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
        <h2 className="modal-title">{taskToEdit ? "Edit Task" : "Add New Task"}</h2>

        {/* Title */}
        <div className="input-group">
          <label className="modal-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="modal-input"
            placeholder="Enter task title"
          />
          <button
            className="ai-button"
            onClick={handleAIGenerate}
            disabled={loadingAI}
          >
            {loadingAI ? "Generating..." : "✨ Generate Subtasks with AI"}
          </button>
        </div>

        {/* Description */}
        <div className="description-container">
          <label className="modal-label">Description</label>
          <EditorContent editor={editor} className={`modal-editor ${darkMode ? "dark-mode" : ""}`} />
        </div>

        {/* Priority & Status */}
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

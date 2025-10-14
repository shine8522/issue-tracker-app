const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post("/", async (req, res) => {
 
  const { title, description, status,priority } = req.body;
  if(!title || !title.trim()){
    return res.status(400).json({message: "Tile is required"});
  }
  try {
    const newTask = new Task({ title, description, 
      status: status|| "todo",
      priority: priority,
    });
    
    const savedTask = await newTask.save();
 
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task status
router.put("/:id", async (req, res) => {
 
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,   { $set: req.body },
     
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete task (optional)
router.delete("/:id", async (req, res) => {
  try {
     const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
     res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

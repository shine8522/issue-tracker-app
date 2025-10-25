const express = require('express');
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// All task routes below require authentication
router.use(protect);

// GET /tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }); // filter by logged-in user
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});


router.post('/', async (req, res) => {
  const { title, description, priority, status } = req.body;
  const task = await Task.create({
    title,
    description,
    priority,
    status,
    user: req.user._id,
  });
  res.status(201).json(task);
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure the logged-in user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});


module.exports = router;

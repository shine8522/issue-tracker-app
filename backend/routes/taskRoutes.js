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

module.exports = router;

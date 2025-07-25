import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Route to create a new task, now includes the optional title
router.post('/', auth, async (req, res) => {
  const { task, date, title } = req.body;
  try {
    const newTask = new Task({ task, title, date, userId: req.user.id });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Route to get all tasks for a specific date
router.get('/', auth, async (req, res) => {
  const { date, filter } = req.query;
  try {
    let query = { userId: req.user.id };

    if (filter === 'today' && date) {
      query.date = date;
    } else if (filter === 'month' && date) {
      const [dd, mm, yyyy] = date.split('-');
      const monthRegex = new RegExp(`-${mm}-${yyyy}$`);
      query.date = { $regex: monthRegex };
    }
    // else filter === 'all' → no additional query added

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Route to delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Route to update a task, now includes the title
router.put('/:id', auth, async (req, res) => {
  const { task, title } = req.body;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { task, title },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';

interface Props {
  onTaskCreated: () => void;
  selectedDate: string;
}

const TaskForm: React.FC<Props> = ({ onTaskCreated, selectedDate }) => {
  const [task, setTask] = useState('');
  const [title, setTitle] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      await axios.post('/api/tasks', { task, title, date: selectedDate }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setTask('');
      setTitle('');
      setSuccess('Task added successfully!');
      setTimeout(() => setSuccess(''), 1500);
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Optional title (e.g., Call, Reminder)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          placeholder="Enter task description..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 rounded-md hover:from-indigo-600 hover:to-blue-600 shadow font-semibold transition-all"
        >
          Add Task
        </button>
        {success && <p className="text-green-600 text-center text-sm mt-2">{success}</p>}
      </form>
  );
};

export default TaskForm;

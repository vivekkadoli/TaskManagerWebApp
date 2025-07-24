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
      await axios.post(
        '/api/tasks',
        { task, title, date: selectedDate },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
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
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold text-white mb-2">Add a New Task</h3>

      <input
        type="text"
        placeholder="Optional title (e.g. Call, Reminder)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        type="text"
        placeholder="Describe your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md font-semibold transition-all"
      >
        Add Task
      </button>

      {success && (
        <p className="text-green-400 text-sm text-center">{success}</p>
      )}
    </form>
  );
};

export default TaskForm;

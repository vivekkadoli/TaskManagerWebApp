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
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!task.trim()) {
      setError('Task description cannot be empty.');
      return;
    }
    try {
      await axios.post(
        '/api/tasks',
        { task, title, date: selectedDate },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setTask('');
      setTitle('');
      setSuccess('Task added successfully!');
      setTimeout(() => setSuccess(''), 1200);
      onTaskCreated();
    } catch (error) {
      setError('Error creating task');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white/95 backdrop-blur rounded-lg shadow-lg border border-indigo-200 p-6 mb-3"
      autoComplete="off"
    >
      <h2 className="text-lg font-bold mb-3 text-indigo-700">Add a New Task</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task Title"
        className="w-full px-3 py-2 text-gray-900 bg-indigo-50 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
      <textarea
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Task Description"
        className="w-full px-3 py-2 text-gray-900 bg-indigo-50 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        rows={3}
      />
      {error && (
        <div className="mb-2 text-red-600 text-left">{error}</div>
      )}
      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-indigo-500 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
      >
        Add Task
      </button>
      {success && (
        <div className="mt-2 text-green-600 font-semibold text-center">{success}</div>
      )}
    </form>
  );
};

export default TaskForm;

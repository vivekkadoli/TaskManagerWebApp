import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';
import { PlusCircle } from 'lucide-react';

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
      setSuccess('✅ Task added successfully!');
      setTimeout(() => setSuccess(''), 1500);
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-xl"
    >
      <h3 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-600" />
        Add a New Task
      </h3>
      <input
        type="text"
        placeholder="Optional title (e.g., Call, Reminder)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <textarea
        placeholder="Describe your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none min-h-[80px]"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all"
      >
        ➕ Add Task
      </button>
      {success && <p className="text-green-600 text-center text-sm mt-2">{success}</p>}
    </form>
  );
};

export default TaskForm;
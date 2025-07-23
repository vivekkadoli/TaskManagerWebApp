import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';

interface Props {
  onTaskCreated: () => void;
  selectedDate: string;
}

const TaskForm: React.FC<Props> = ({ onTaskCreated, selectedDate }) => {
  const [task, setTask] = useState('');
  const [success, setSuccess] = useState(''); // State for success message
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      await axios.post('/api/tasks', { task, date: selectedDate }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setTask('');
      setSuccess('Task added successfully!'); // Set success message
      setTimeout(() => setSuccess(''), 1500); // Clear message after 1.5 seconds
      onTaskCreated(); // Trigger task list refresh
    } catch (error) {
      console.error('Error creating task', error);
      // Optionally, add an error state here as well
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Add New Task</h3>
      {success && <p className="text-green-600 text-center text-sm mb-2">{success}</p>} {/* Show success message */}
      <input
        type="text"
        placeholder="Enter task description..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="px-4 py-2 rounded-lg border-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        aria-label="New task description"
      />
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold w-full"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';

interface Props {
  onTaskCreated: () => void;
  selectedDate: string;
}

const TaskForm: React.FC<Props> = ({ onTaskCreated, selectedDate }) => {
  const [task, setTask] = useState('');
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
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="px-3 py-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
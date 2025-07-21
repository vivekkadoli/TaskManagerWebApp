import React, { useState } from 'react';
import axios from 'axios';

interface TaskFormProps {
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post('http://localhost:5000/api/tasks', { text });
    setText('');
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        className="border rounded p-2 flex-grow"
        placeholder="Enter task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
};

export default TaskForm;

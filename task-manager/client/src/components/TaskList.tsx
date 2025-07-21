import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  _id: string;
  text: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const fetchTasks = async () => {
    const { data } = await axios.get('http://localhost:5000/api/tasks');
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingId(task._id);
    setEditText(task.text);
  };

  const handleUpdate = async (id: string) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { text: editText });
    setEditingId(null);
    setEditText('');
    fetchTasks();
  };

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <li key={task._id} className="flex justify-between items-center border p-2 rounded">
          {editingId === task._id ? (
            <>
              <input
                className="border p-1 flex-grow mr-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={() => handleUpdate(task._id)} className="bg-green-500 text-white px-2 py-1 rounded">
                Save
              </button>
            </>
          ) : (
            <>
              <span>{task.text}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(task)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;

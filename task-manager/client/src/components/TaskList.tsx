import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';
import { Pencil, Trash2, Save, XCircle } from 'lucide-react';

interface TaskType {
  _id: string;
  task: string;
  date: string;
  userId: string;
}

interface TaskListProps {
  selectedDate?: string;
  refreshTrigger?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ selectedDate, refreshTrigger }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!user?.token) {
      setTasks([]);
      return;
    }

    try {
      const res = await fetch(`/api/tasks?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Session expired. Please log in again.');
        } else {
          throw new Error(`Error ${res.status}`);
        }
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid data');
      setTasks(data);
    } catch (err) {
      console.error("Task fetch failed", err);
    }
  }, [user, selectedDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]);

  const handleEdit = (task: TaskType) => {
    setEditingId(task._id);
    setEditValue(task.task);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim() || !user?.token) return;
    try {
      await axios.put(`/api/tasks/${id}`, { task: editValue }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEditingId(null);
      setEditValue('');
      fetchTasks();
    } catch (err) {
      console.error("Failed to save task edit", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.token) return;
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  if (error) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  if (!user) {
    return <p className="text-gray-400 text-center mt-4">Login to see your tasks.</p>;
  }

  return (
    <div className="w-full h-full px-4 py-4 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
        📅 Tasks for {selectedDate}
      </h2>

      {tasks.length > 0 ? (
        <div className="flex flex-col gap-5">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white shadow hover:shadow-md transition-all"
            >
              {editingId === task._id ? (
                <>
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded resize-none"
                  />
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="flex items-center gap-1 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-800">{task.task}</p>
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(task)}
                      className="flex items-center gap-1 px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex items-center gap-1 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-10 text-lg border border-dashed border-gray-300 p-4 rounded-md">
          No tasks found for this date.
        </p>
      )}
    </div>
  );
};

export default TaskList;

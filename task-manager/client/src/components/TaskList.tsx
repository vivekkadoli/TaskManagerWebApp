import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';

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
    } catch {
      // silently ignore
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
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.token) return;
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchTasks();
    } catch {
      // ignore
    }
  };

  if (error) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  if (!user) {
    return <p className="text-gray-400 text-center mt-4">Login to see your tasks.</p>;
  }

  return (
    <div className="w-full h-full bg-white bg-opacity-90 rounded-xl shadow-xl px-6 py-6 overflow-y-auto">
      <h2 className="text-center text-2xl font-bold text-indigo-800 mb-6">
        Tasks for {selectedDate}
      </h2>

      {tasks.length > 0 ? (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-blue-50 border border-indigo-200 rounded-lg p-4 shadow-sm"
            >
              {editingId === task._id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800 font-medium">{task.task}</p>
                  {/* <p className="text-sm text-gray-600 mt-1">📅 {task.date}</p> */}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-8 text-lg border border-dashed border-gray-300 p-4 rounded-md">
          No tasks found for this day.
        </p>
      )}
    </div>
  );
};

export default TaskList;
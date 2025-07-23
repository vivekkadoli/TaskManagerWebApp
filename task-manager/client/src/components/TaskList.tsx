import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';

type TaskType = {
  _id: string;
  task: string;
  date: string;
  userId: string;
};

type TaskListProps = {
  selectedDate?: string;
};

const TaskList: React.FC<TaskListProps> = ({ selectedDate }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const fetchTasks = useCallback(async () => {
    setError('');
    try {
      const response = await fetch(`/api/tasks?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response: not an array');
      }

      setTasks(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load tasks';
      setError(errorMessage);
      setTasks([]);
    }
  }, [selectedDate, user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [fetchTasks, user]);

  const handleDelete = async (taskId: string) => {
    setError('');
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
      }

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete task';
      setError(errorMessage);
    }
  };

  const handleEdit = (task: TaskType) => {
    setEditingId(task._id);
    setEditValue(task.task);
  };

  const handleEditSave = async (taskId: string) => {
    setError('');
    try {
      await axios.put(`/api/tasks/${taskId}`, { task: editValue }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setEditingId(null);
      setEditValue('');
      fetchTasks();
    } catch {
      setError('Failed to update task');
    }
  };

  if (!user) {
    return <p className="text-center text-gray-500">Please log in to view your tasks.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
      {error && <p className="text-red-500">{error}</p>}
      {Array.isArray(tasks) && tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 border-l-4 border-blue-500 transition hover:shadow-lg"
            >
              {editingId === task._id ? (
                <div>
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="px-3 py-2 rounded w-full"
                  />
                  <button
                    onClick={() => handleEditSave(task._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition mt-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition mt-2 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.task}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Due: {task.date}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
        <p className="text-gray-500">No tasks found for this day.</p>
      )}
    </div>
  );
};

export default TaskList;
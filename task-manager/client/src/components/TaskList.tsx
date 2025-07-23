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
  refreshTrigger?: boolean; // New prop to trigger re-fetch
};

const TaskList: React.FC<TaskListProps> = ({ selectedDate, refreshTrigger }) => {
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
    // Add refreshTrigger to the dependency array
  }, [fetchTasks, user, refreshTrigger]); 

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
    if (!editValue.trim()) {
      setError('Task description cannot be empty.');
      return;
    }
    try {
      await axios.put(`/api/tasks/${taskId}`, { task: editValue }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setEditingId(null);
      setEditValue('');
      fetchTasks(); // Re-fetch tasks to show the updated task
    } catch {
      setError('Failed to update task');
    }
  };

  if (!user) {
    return <p className="text-center text-gray-500">Please log in to view your tasks.</p>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Your Tasks</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {Array.isArray(tasks) && tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-700 shadow-md rounded-xl p-4 border-l-4 border-blue-500 transition hover:shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              {editingId === task._id ? (
                <div className="flex-grow w-full">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="px-3 py-2 rounded w-full text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex gap-2 mt-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleEditSave(task._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex-grow sm:flex-grow-0"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 flex-grow sm:flex-grow-0"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-white">{task.task}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Due: {task.date}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
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
        <p className="text-gray-400 text-center py-8">No tasks found for this day. Add one above! 🎉</p>
      )}
    </div>
  );
};

export default TaskList;
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios'; // Ensure axios is imported if used for delete/put

type TaskType = {
  _id: string;
  task: string;
  date: string;
  userId: string;
};

type TaskListProps = {
  selectedDate?: string;
  refreshTrigger?: boolean; // Added prop to trigger refresh
};

const TaskList: React.FC<TaskListProps> = ({ selectedDate, refreshTrigger }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const fetchTasks = useCallback(async () => {
    setError('');
    // Only fetch if user is logged in
    if (!user || !user.token) {
      setTasks([]); // Clear tasks if no user is logged in
      return;
    }

    try {
      const response = await fetch(`/api/tasks?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Ensure token is used
        },
      });

      if (!response.ok) {
        // Handle specific errors, e.g., 401 for unauthorized
        if (response.status === 401) {
          setError('Session expired or unauthorized. Please log in again.');
          // Optionally, trigger logout if unauthorized
          // logout();
        } else {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response: not an array');
      }

      setTasks(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch tasks.';
      console.error("Error fetching tasks:", error);
      setError(errorMessage);
    }
  }, [selectedDate, user]); // Depend on selectedDate and user for re-fetching

  // Effect to trigger fetchTasks whenever selectedDate, user, or refreshTrigger changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]); // Added refreshTrigger here

  const handleEdit = (task: TaskType) => {
    setEditingId(task._id);
    setEditValue(task.task);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim() || !user || !user.token) return;

    try {
      await axios.put(`/api/tasks/${id}`, { task: editValue }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setEditingId(null);
      setEditValue('');
      fetchTasks(); // Re-fetch tasks after successful edit
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !user.token) return;

    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      fetchTasks(); // Re-fetch tasks after successful delete
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task.');
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  // Display message if no user is logged in
  if (!user) {
    return <p className="text-gray-400 text-center mt-4">Please log in to view your tasks.</p>;
  }


  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-gray-700 p-4 rounded-md shadow flex flex-col justify-between">
              {editingId === task._id ? (
                <div>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 rounded text-black mb-2"
                  />
                  <button
                    onClick={() => handleSaveEdit(task._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
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
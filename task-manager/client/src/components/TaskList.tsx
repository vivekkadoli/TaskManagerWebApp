import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';
import { Pencil, Trash2, Save, XCircle } from 'lucide-react';

interface TaskType {
  _id: string;
  title?: string;
  task: string;
  date: string;
  userId: string;
}

interface TaskListProps {
  selectedDate: string;
  refreshTrigger?: boolean;
}

type FilterMode = 'today' | 'all' | 'month';

const TaskList: React.FC<TaskListProps> = ({ selectedDate, refreshTrigger }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState<FilterMode>('today');

  const fetchTasks = useCallback(async () => {
    if (!user?.token) {
      setTasks([]);
      return;
    }

    try {
      const res = await axios.get(`/api/tasks?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (res.status !== 200) {
        if (res.status === 401) {
          setError('Session expired. Please log in again.');
        } else {
          throw new Error(`Error ${res.status}`);
        }
      }

      const data = res.data;
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        throw new Error('Invalid data format received for tasks.');
      }

      const sortedTasks = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setTasks(sortedTasks);
      setError('');
    } catch (err) {
      console.error("Task fetch failed", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || `Failed to fetch tasks: ${err.response.status}`);
      } else {
        setError('An unexpected error occurred while fetching tasks.');
      }
      setTasks([]);
    }
  }, [user, selectedDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]);

  const handleEdit = (task: TaskType) => {
    setEditingId(task._id);
    setEditValue(task.task);
    setEditTitle(task.title || '');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim() || !user?.token) return;
    try {
      await axios.put(`/api/tasks/${id}`, { task: editValue, title: editTitle }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEditingId(null);
      setEditValue('');
      setEditTitle('');
      fetchTasks();
    } catch (err) {
      console.error("Failed to save task edit", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || `Failed to update task: ${err.response.status}`);
      } else {
        setError('An unexpected error occurred while updating task.');
      }
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
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || `Failed to delete task: ${err.response.status}`);
      } else {
        setError('An unexpected error occurred while deleting task.');
      }
    }
  };

  if (error) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  if (!user) {
    return <p className="text-gray-400 text-center mt-4">Login to see your tasks.</p>;
  }

  // ---------------------- FILTER LOGIC ---------------------
  const today = new Date(selectedDate);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let filteredTasks = tasks;

  if (filter === 'today') {
    filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    });
  } else if (filter === 'month') {
    filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getMonth() === currentMonth &&
        taskDate.getFullYear() === currentYear
      );
    });
  }

  // ---------------------- GROUPING LOGIC ---------------------
  const groupedTasks: { [date: string]: TaskType[] } = {};
  for (const task of filteredTasks) {
    const dateKey = new Date(task.date).toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2-$1-$3');

    if (!groupedTasks[dateKey]) {
      groupedTasks[dateKey] = [];
    }
    groupedTasks[dateKey].push(task);
  }

  // ---------------------- FORMATTING ---------------------
  const todayStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2-$1-$3');

  const monthName = today.toLocaleDateString('en-US', { month: 'long' });

  // ---------------------- RENDER ---------------------
  const buttonBase = "px-4 py-1 rounded-md font-medium border transition";
  const getButtonClass = (btn: FilterMode) =>
    `${buttonBase} ${filter === btn ? "bg-indigo-600 text-white border-indigo-700" : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"}`;

  return (
    <div className="w-full h-full px-4 py-4">
      {/* === FILTER BUTTONS === */}
      <div className="flex justify-center gap-3 mb-8">
        <button className={getButtonClass('all')} onClick={() => setFilter('all')}>
          All
        </button>
        <button className={getButtonClass('today')} onClick={() => setFilter('today')}>
          Today
        </button>
        <button className={getButtonClass('month')} onClick={() => setFilter('month')}>
          Month
        </button>
      </div>

      {/* === FILTER HEADERS === */}
      {filter === 'today' && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">
            Today is {todayStr}
          </h2>
          <p className="text-gray-800 font-medium">Total Tasks: {filteredTasks.length}</p>
        </div>
      )}

      {filter === 'month' && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">
            {monthName}
          </h2>
          <p className="text-gray-800 font-medium">Total Tasks: {filteredTasks.length}</p>
        </div>
      )}

      {Object.keys(groupedTasks).length > 0 ? (
        Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <div key={date} className="mb-10">
            <h2 className="text-center text-xl font-bold text-indigo-700 mb-6 relative">
              <span className="relative z-10 bg-gradient-to-br from-yellow-50 via-orange-100 to-white px-4">
                {date}
              </span>
              <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-900 transform -translate-y-1/2 z-0"></span>
            </h2>

            <div className="flex flex-col gap-5">
              {dateTasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white shadow hover:shadow-md transition-all"
                >
                  {editingId === task._id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 text-lg font-semibold"
                      />
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded resize-none"
                        rows={3}
                        placeholder="Task description..."
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
                      {task.title && <h3 className="font-bold text-xl text-gray-900 mb-2">{task.title}</h3>}
                      <p className="text-lg text-gray-800 whitespace-pre-wrap">{task.task}</p>
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
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center mt-10 text-lg border border-dashed border-gray-300 p-4 rounded-md">
          No tasks found for this filter.
        </p>
      )}
    </div>
  );
};

export default TaskList;

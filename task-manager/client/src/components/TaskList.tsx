// Same import section
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../auth/useAuth";
import axios from "axios";
import {
  Pencil, Trash2, Save, XCircle,
} from "lucide-react";

// Types
type FilterMode = "all" | "today" | "month";
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

// Config
const TASK_CONTAINER_HEIGHT = 600;
const NO_TASK_IMG = "https://cdn-icons-png.flaticon.com/512/6134/6134065.png"; // dark compatible

const TABS = [
  { name: "all" as FilterMode, label: "All" },
  { name: "today" as FilterMode, label: "Today" },
  { name: "month" as FilterMode, label: "Month" }
];

const TaskList: React.FC<TaskListProps> = ({ selectedDate, refreshTrigger }) => {
  const { user } = useAuth();
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterMode>("today");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const hiddenListRef = useRef<HTMLUListElement>(null);
  const [tasksPerPage, setTasksPerPage] = useState(1);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user?.token) {
      setAllTasks([]);
      return;
    }
    try {
      let url = "/api/tasks";
      if (filter === "today" || filter === "month") url += `?date=${selectedDate}`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAllTasks(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Could not fetch tasks");
      setAllTasks([]);
    }
  }, [user, filter, selectedDate]);

  useEffect(() => {
    fetchTasks();
    setPage(1);
  }, [fetchTasks, refreshTrigger, filter]);

  const saveEdit = async (id: string) => {
    if (!editVal.trim() || !user?.token) return;
    await axios.put(`/api/tasks/${id}`,
      { task: editVal, title: editTitle },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setEditingId(null);
    setEditVal("");
    setEditTitle("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (!user?.token) return;
    await axios.delete(`/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    fetchTasks();
  };

  const today = new Date(selectedDate);
  const month = today.getMonth(), year = today.getFullYear();

  let filteredTasks = allTasks;
  if (filter === "today") {
    filteredTasks = filteredTasks.filter(t => {
      const d = new Date(t.date);
      return d.getDate() === today.getDate() &&
             d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    });
  } else if (filter === "month") {
    filteredTasks = filteredTasks.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }

  const sortedTasks = filteredTasks
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  useEffect(() => {
    if (!hiddenListRef.current) return;

    let total = 0, count = 0;
    const items = Array.from(hiddenListRef.current.children);
    for (const el of items) {
      const height = (el as HTMLElement).offsetHeight;
      if (total + height > TASK_CONTAINER_HEIGHT - 64) break;
      total += height;
      count++;
    }
    setTasksPerPage(count || 1);
  }, [sortedTasks, page, editingId, editVal, editTitle]);

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const showTasks = sortedTasks.slice(
    (page - 1) * tasksPerPage,
    page * tasksPerPage
  );

  return (
    <section className="flex flex-col w-full h-full m-0 p-0 bg-[#121212] text-white">
      <div className="flex flex-col h-full w-full bg-[#121212] shadow-inner">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between h-14 px-6 bg-[#1F1F1F] border-b border-neutral-800">
<div className="flex space-x-6">
  {TABS.map(tab => (
    <button
      key={tab.name}
      onClick={() => { setFilter(tab.name); setPage(1); }}
      className={`relative pb-1 text-sm font-semibold uppercase tracking-wide transition-colors duration-200
        ${filter === tab.name
          ? 'text-white after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-blue-500'
          : 'text-gray-400 hover:text-white'
        } focus:outline-none focus:ring-0 focus:border-none`}
    >
      {tab.label}
    </button>
  ))}
</div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-white hover:text-blue-400 disabled:opacity-30"
            >
              &lt; Prev
            </button>
            <span className="text-sm font-medium text-gray-300">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-white hover:text-blue-400 disabled:opacity-30"
            >
              Next &gt;
            </button>
          </div>
        </div>

        {/* HIDDEN MEASURE */}
        <ul ref={hiddenListRef} className="absolute opacity-0 pointer-events-none w-[800px] h-0 overflow-hidden">
          {sortedTasks.map(task => (
            <li key={task._id} className="py-5">
              {task.title && <p className="font-bold text-white">{task.title}</p>}
              <p className="text-gray-300">{task.task}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(task.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>

        {/* TASK LIST */}
        <div className="px-6 py-4 h-full flex-1 overflow-y-auto">
          {error ? (
            <div className="py-10 text-center text-red-400">{error}</div>
          ) : showTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <img src={NO_TASK_IMG} alt="No Tasks" className="w-40 mb-6 opacity-80" />
              <p className="font-bold text-lg text-orange-400">No tasks to show</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {showTasks.map(t => (
                <li key={t._id} className="py-5 flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1 pr-4">
                    {t.title && <p className="font-bold text-blue-400">{t.title}</p>}
                    <p className="text-gray-200 whitespace-pre-wrap">{t.task}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-shrink-0 flex gap-2 mt-4 md:mt-0">
                    {editingId !== t._id ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(t._id);
                            setEditVal(t.task);
                            setEditTitle(t.title || "");
                          }}
                          className="px-4 py-2 bg-lime-500 text-black rounded-full text-sm flex items-center gap-1 hover:scale-105"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                        <button
                          onClick={() => deleteTask(t._id)}
                          className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm flex items-center gap-1 hover:scale-105"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </>
                    ) : (
                      <div className="w-full">
                        <input
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          placeholder="Title (optional)"
                          className="w-full mb-2 px-3 py-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
                        />
                        <textarea
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveEdit(t._id)}
                            className="px-4 py-1 bg-emerald-500 text-white rounded-full text-sm flex items-center gap-1"
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-1 bg-gray-500 text-white rounded-full text-sm flex items-center gap-1"
                          >
                            <XCircle size={16} /> Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default TaskList;

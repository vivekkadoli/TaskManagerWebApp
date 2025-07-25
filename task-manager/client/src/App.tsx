import React, { useState, useEffect, useCallback, useRef } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';
import { LogOut, ChevronLeft, ChevronRight, CalendarDays, XCircle } from 'lucide-react';
import axios from 'axios';

interface TaskType {
  _id: string;
  title?: string;
  task: string;
  date: string;
  userId: string;
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const CalendarView: React.FC<{
  currentDate: Date;
  onDateSelect: (date: string) => void;
  allTasks: TaskType[];
}> = ({ currentDate, onDateSelect, allTasks }) => {
  const datesWithTasks = new Set(allTasks.map(task => formatDate(new Date(task.date))));
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  useEffect(() => {
    setDisplayDate(currentDate);
  }, [currentDate]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    calendarDays.push(date.toISOString().split('T')[0]);
  }

  const handleMonthYearChange = (selectedMonth: number, selectedYear: number) => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onDateSelect(formatDate(newDate));
    setDisplayDate(newDate);
    setShowMonthYearPicker(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="w-full relative p-4 bg-indigo-700 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 text-white">
        <button
          onClick={() => setDisplayDate(new Date(year, month - 1, 1))}
          className="p-1 rounded-full hover:bg-indigo-600 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <h4
            className="text-xl font-semibold cursor-pointer hover:text-yellow-300 transition-colors"
            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
          >
            {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h4>
          <button
            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
            className="p-1 rounded-full hover:bg-indigo-600 transition-colors"
            aria-label="Select month and year"
          >
            <CalendarDays size={20} />
          </button>
        </div>
        <button
          onClick={() => setDisplayDate(new Date(year, month + 1, 1))}
          className="p-1 rounded-full hover:bg-indigo-600 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {showMonthYearPicker && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-indigo-800 p-4 rounded-lg shadow-lg flex flex-col gap-4 z-20">
          <h5 className="text-white text-lg font-bold mb-2">Select Month and Year</h5>
          <div className="flex gap-4">
            <select
              value={month}
              onChange={(e) => handleMonthYearChange(parseInt(e.target.value), year)}
              className="bg-indigo-900 text-white p-2 rounded focus:ring-2 focus:ring-yellow-400 w-full"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(year, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => handleMonthYearChange(month, parseInt(e.target.value))}
              className="bg-indigo-900 text-white p-2 rounded focus:ring-2 focus:ring-yellow-400 w-full"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowMonthYearPicker(false)}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-semibold text-indigo-200">
            {day}
          </div>
        ))}
        {calendarDays.map((dateString, index) => {
          const isToday = dateString && dateString === formatDate(new Date());
          const isSelected = dateString && dateString === formatDate(currentDate);
          const hasTasks = dateString && datesWithTasks.has(dateString);
          const dayNumber = dateString ? new Date(dateString).getDate() : null;

          return (
            <div
              key={index}
              className={`p-2 rounded-md cursor-pointer transition-colors
                ${dateString ? 'text-white hover:bg-indigo-500' : 'text-gray-500'}
                ${isToday ? 'bg-yellow-400 text-blue-900 font-bold' : ''}
                ${isSelected && !isToday ? 'bg-indigo-500' : ''}
                flex flex-col items-center justify-center relative`}
              onClick={() => {
                if (dateString) {
                  onDateSelect(dateString);
                }
              }}
            >
              {dayNumber}
              {hasTasks && (
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


const DashboardLayout: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date())
  );
  const [refresh, setRefresh] = useState(false);
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);
  const { user, logout } = useAuth();
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  const refreshTasks = () => setRefresh(!refresh);

  const fetchAllTasks = useCallback(async () => {
    if (!user?.token) {
      setAllTasks([]);
      return;
    }
    try {
      const res = await axios.get('/api/tasks/all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const formattedTasks = res.data.map((task: TaskType) => ({
        ...task,
        date: formatDate(new Date(task.date))
      }));
      setAllTasks(formattedTasks);
    } catch (err) {
      console.error("Failed to fetch all tasks for calendar", err);
      setAllTasks([]);
    }
  }, [user]);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks, refresh]);

  const handleCalendarDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    refreshTasks();
    setShowCalendarPopup(false);
  };

  const calendarTriggerRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState({});

  useEffect(() => {
    if (showCalendarPopup && calendarTriggerRef.current) {
      const rect = calendarTriggerRef.current.getBoundingClientRect();
      setPopupStyle({
        position: 'absolute',
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        zIndex: 50,
        width: `${rect.width}px`
      });
    }
  }, [showCalendarPopup]);

  return (
    <div className="h-screen w-screen flex font-sans overflow-hidden bg-gray-900">
      <div className="w-[340px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-md flex-shrink-0 flex flex-col text-white">
        <div className="px-6 py-8 flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-yellow-300 text-3xl">📌</span> My Tasks
            </h2>

            <div className="relative space-y-3 mb-6" ref={calendarTriggerRef}>
              <div
                className="flex items-center justify-between p-2 rounded-md bg-white text-gray-800 border border-gray-300 cursor-pointer focus-within:ring-2 focus-within:ring-yellow-400"
                onClick={() => setShowCalendarPopup(true)}
              >
                <span className="font-semibold">
                  {new Date(selectedDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
                <CalendarDays size={20} className="text-gray-600" />
              </div>

              {showCalendarPopup && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
                  onClick={() => setShowCalendarPopup(false)}
                >
                  <div
                    className="absolute bg-indigo-700 p-2 rounded-lg shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                    style={popupStyle}
                  >
                    <button
                      onClick={() => setShowCalendarPopup(false)}
                      className="absolute top-0 right-0 p-1 rounded-full text-white bg-black hover:bg-gray-800 -translate-y-1/2 translate-x-1/2 z-50 border border-white shadow-lg"
                      aria-label="Close calendar"
                    >
                      <XCircle size={20} />
                    </button>
                    <CalendarView
                      currentDate={new Date(selectedDate)}
                      onDateSelect={handleCalendarDateSelect}
                      allTasks={allTasks}
                    />
                  </div>
                </div>
              )}
            </div>

            <TaskForm onTaskCreated={refreshTasks} selectedDate={selectedDate} />
        </div>

        {user && (
            <div className="px-6 py-4 border-t border-indigo-500 bg-black bg-opacity-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-400 rounded-full text-indigo-800 text-lg font-bold uppercase">
                {user.email.charAt(0)}
                </div>
                <div className="flex-grow overflow-hidden">
                <p className="text-sm font-semibold truncate" title={user.email}>{user.email}</p>
                </div>
                <button
                onClick={logout}
                className="p-2 text-indigo-200 hover:bg-indigo-700 hover:text-white rounded-md transition-colors"
                title="Logout"
                >
                <LogOut size={20} />
                </button>
            </div>
            </div>
        )}
      </div>

      <div className="flex-1 bg-gradient-to-br from-yellow-50 via-orange-100 to-white px-10 py-8 overflow-hidden">
        <div className="h-full max-h-screen overflow-y-auto pr-2">
          <TaskList selectedDate={selectedDate} refreshTrigger={refresh} />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-row">
        <div className="w-[70%] h-full bg-gradient-to-br from-indigo-900 to-sky-800 text-white flex flex-col justify-center items-start px-20 space-y-10">
          <h1 className="text-6xl font-extrabold leading-tight drop-shadow-lg">
            Welcome to <span className="text-yellow-300">TaskFlow</span>
          </h1>
          <p className="text-xl text-slate-100 max-w-xl leading-relaxed">
            Organize your day, boost your productivity, and achieve your goals effortlessly.
          </p>
        </div>

        <div className="w-[30%] h-full relative flex items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#dbeafe] overflow-hidden">
          <div className="absolute w-[300px] h-[300px] bg-blue-300 opacity-30 rounded-full blur-[120px] top-[-60px] right-[-80px] animate-pulse"></div>
          <div className="absolute w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-[80px] bottom-[-60px] left-[-40px] animate-bounce-slow"></div>

          <div className="w-full h-full flex flex-col items-center justify-center z-10 px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight mb-2">
                Access TaskFlow
              </h2>
              <p className="text-sm text-gray-600">Stay on top of your productivity</p>
            </div>

            <div className="w-full max-w-md space-y-6">
              {showForgot ? (
                <ForgotPasswordForm
                  onSwitch={() => {
                    setShowForgot(false);
                    setShowLogin(true);
                  }}
                />
              ) : showLogin ? (
                <LoginForm
                  onSwitch={() => setShowLogin(false)}
                  onForgot={() => {
                    setShowForgot(true);
                    setShowLogin(false);
                  }}
                />
              ) : (
                <RegisterForm onSwitch={() => setShowLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardLayout />;
};

const RootApp: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
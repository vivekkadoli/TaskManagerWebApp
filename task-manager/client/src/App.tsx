import React, { useState, useRef, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/useAuth";

const TaskManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [refresh, setRefresh] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();

  const refreshTasks = () => setRefresh(!refresh);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <header className="fixed top-0 right-0 w-full p-4 z-20 flex justify-end">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-sm font-bold uppercase">
                {user.email.charAt(0)}
              </div>
              <span className="hidden md:block">{user.email}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-1">
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex flex-col md:flex-row gap-8 flex-grow pt-20">
        <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full md:w-80 flex-shrink-0">
          <h2 className="text-xl font-bold mb-4">📅 Task Manager</h2>
          <input
            type="date"
            className="mb-4 px-3 py-2 rounded w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <TaskForm onTaskCreated={refreshTasks} selectedDate={selectedDate} />
        </div>
        <div className="flex-1 px-6 py-4">
          <h3 className="text-2xl font-bold mb-6 text-right">
            Tasks for {selectedDate}
          </h3>
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
        {/* Left 70% Panel */}
        <div className="w-[70%] h-full bg-gradient-to-br from-indigo-900 to-sky-800 text-white flex flex-col justify-center items-start px-20 space-y-10">
          {/* Title */}
          <h1 className="text-6xl font-extrabold leading-tight drop-shadow-lg">
            Welcome to <span className="text-yellow-300">TaskFlow</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-100 max-w-xl leading-relaxed">
            Organize your day, boost your productivity, and achieve your goals
            effortlessly. Plan smarter. Do better.
          </p>

          {/* Optional visual */}
          {/* <div className="mt-6 animate-pulse">
    <svg className="w-24 h-24 text-yellow-300 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.75 17L14.25 12L9.75 7" />
    </svg>
  </div> */}
        </div>

        {/* Right 30% Panel - Modern, Rich UI without white box */}
        <div className="w-[30%] h-full relative flex items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#dbeafe] overflow-hidden">
          {/* Decorative Floating Blur Bubble */}
          <div className="absolute w-[300px] h-[300px] bg-blue-300 opacity-30 rounded-full blur-[120px] top-[-60px] right-[-80px] animate-pulse"></div>

          {/* Floating highlight orb */}
          <div className="absolute w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-[80px] bottom-[-60px] left-[-40px] animate-bounce-slow"></div>

          {/* Centered Form Content */}
          <div className="w-full h-full flex flex-col items-center justify-center z-10 px-8">
            {/* Branded Heading */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight mb-2">
                Access TaskFlow
              </h2>
              <p className="text-sm text-gray-600">
                Stay on top of your productivity
              </p>
            </div>

            {/* Dynamic Auth Form Section */}
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

  return <TaskManager />;
};

const RootApp: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;

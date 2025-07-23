import React, { useState, useRef, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';

const TaskManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refresh, setRefresh] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown to handle clicks outside

  const { user, logout } = useAuth(); // Get user and logout from auth context

  const refreshTasks = () => setRefresh(!refresh);
  console.log()
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      {/* Header with user info and dropdown - Now fixed at top right */}
      <header className="fixed top-0 right-0 w-full p-4 z-20 flex justify-end">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-sm font-bold uppercase">
                {user.email.charAt(0)}
              </div>
              <span className="hidden md:block">{user.email}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                {/* <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    // Handle settings click
                    setIsDropdownOpen(false);
                  }}
                >
                  Settings
                </a> */}
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main content area - Added pt-20 to offset for the fixed header */}
      <div className="flex flex-col md:flex-row gap-8 flex-grow pt-20">
        {/* Left sidebar for TaskForm */}
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
        
        {/* Right content area for TaskList */}
        <div className="flex-1 px-6 py-4">
          <h3 className="text-2xl font-bold mb-6 text-right text-white">Tasks for {selectedDate}</h3> 
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
      // Modified this wrapper div to create a two-column layout for auth forms
      <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
        {/* Left side: Modern Design Section - Now covers 80% */}
        {/* Added flex-grow to ensure it takes remaining space */}
        <div className="w-full md:w-4/5 bg-gradient-to-br from-blue-700 to-purple-800 flex items-center justify-center p-8 text-center flex-grow">
          <div className="text-white">
            <h1 className="text-5xl font-extrabold mb-4 animate-fade-in-up">Welcome to TaskFlow!</h1>
            <p className="text-xl leading-relaxed opacity-90 animate-fade-in-down">
              Organize your day, boost your productivity, and achieve your goals effortlessly.
            </p>
            <div className="mt-10">
              <svg className="w-24 h-24 mx-auto text-white opacity-80 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Right side: Authentication Forms - Now covers 20% and is pushed to the right */}
        {/* Changed md:w-1/5 to md:w-1/4 and added min-w-[320px] to ensure forms are not cut off */}
        {/* Added flex-shrink-0 to prevent this column from shrinking */}
        <div className="w-full md:w-1/4 min-w-[320px] flex items-center justify-center p-4 flex-shrink-0">
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

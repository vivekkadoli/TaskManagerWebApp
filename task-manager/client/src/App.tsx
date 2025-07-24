import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';
import { LogOut } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [refresh, setRefresh] = useState(false);
  const { user, logout } = useAuth();

  const refreshTasks = () => setRefresh(!refresh);

  return (
    <div className="h-screen w-screen flex font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[340px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-md flex-shrink-0 flex flex-col text-white">
        <div className="px-6 py-8 flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-yellow-300 text-3xl">📌</span> My Tasks
            </h2>

            <div className="space-y-3 mb-6">
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{ colorScheme: 'light' }}
            />
            </div>

            <TaskForm onTaskCreated={refreshTasks} selectedDate={selectedDate} />
        </div>

        {/* User Profile Section */}
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

      {/* Main content */}
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
        {/* Left 70% Panel */}
        <div className="w-[70%] h-full bg-gradient-to-br from-indigo-900 to-sky-800 text-white flex flex-col justify-center items-start px-20 space-y-10">
          <h1 className="text-6xl font-extrabold leading-tight drop-shadow-lg">
            Welcome to <span className="text-yellow-300">TaskFlow</span>
          </h1>
          <p className="text-xl text-slate-100 max-w-xl leading-relaxed">
            Organize your day, boost your productivity, and achieve your goals effortlessly.
          </p>
        </div>

        {/* Right 30% Panel */}
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

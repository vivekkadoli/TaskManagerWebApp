import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm'; // Import the new component
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';

const TaskManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refresh, setRefresh] = useState(false);

  const refreshTasks = () => setRefresh(!refresh);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col md:flex-row gap-8">
      <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full md:w-1/3">
        <h2 className="text-xl font-bold mb-4">📅 Task Manager</h2>
        <input
          type="date"
          className="mb-4 px-3 py-2 rounded w-full"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <TaskForm onTaskCreated={refreshTasks} selectedDate={selectedDate} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">Tasks for {selectedDate}</h3>
        <TaskList selectedDate={selectedDate} refreshTrigger={refresh} /> {/* Pass refreshTrigger to TaskList */}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false); // State to control ForgotPasswordForm visibility

  if (!user) {
    if (showForgot) {
      return (
        <ForgotPasswordForm
          onSwitch={() => {
            setShowForgot(false); // Hide forgot password form
            setShowLogin(true); // Show login form
          }}
        />
      );
    }
    return showLogin ? (
      <LoginForm
        onSwitch={() => setShowLogin(false)} // Switch to Register
        onForgot={() => {
          setShowForgot(true); // Show Forgot Password
          setShowLogin(false); // Hide Login
        }}
      />
    ) : (
      <RegisterForm onSwitch={() => setShowLogin(true)} /> // Switch to Login
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
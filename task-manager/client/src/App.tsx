import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
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
        <TaskList selectedDate={selectedDate} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (!user) {
    return showLogin ? (
      <LoginForm onSwitch={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onSwitch={() => setShowLogin(true)} />
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
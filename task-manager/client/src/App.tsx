import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const reloadTasks = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm onTaskAdded={reloadTasks} />
      <TaskList key={String(refresh)} />
    </div>
  );
};

export default App;

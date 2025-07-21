import TaskForm from '../../client/src/components/TaskForm';
import TaskList from '../../client/src/components/TaskList';

const App = () => {
  const handleAddTask = async (task: { title: string; description: string }) => {
    try {
      await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      // Optionally, you can refresh TaskList from here if lifted state is used.
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm onAdd={handleAddTask} />
      <TaskList />
    </div>
  );
};

export default App;
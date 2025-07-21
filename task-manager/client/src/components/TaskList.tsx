import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      {tasks.map(task => (
        <div key={task._id} className="border p-4 mb-2 rounded shadow">
          <h3 className="font-bold text-lg">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <button
            onClick={() => handleDelete(task._id)}
            className="text-red-500 mt-2 underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
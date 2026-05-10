import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await getTasks();
        setTasks(data);
      } catch {
        setError('Impossible de charger les tâches. Le backend est-il démarré ?');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    try {
      const { data } = await createTask(newTask);
      setTasks((prev) => [data, ...prev]);
    } catch {
      setError('Impossible de créer la tâche.');
    }
  };

  const toggleTask = async (id, terminee) => {
    try {
      const { data } = await updateTask(id, { terminee });
      setTasks((prev) => prev.map(t => t._id === id ? data : t));
    } catch {
      setError('Impossible de modifier la tâche.');
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter(t => t._id !== id));
    } catch {
      setError('Impossible de supprimer la tâche.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <h1>📝 Gestion des Tâches</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>
            ✕
          </button>
        </div>
      )}

      <TaskForm onAdd={addTask} />

      {loading ? (
        <p>Chargement des tâches...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onDelete={removeTask}
          onToggle={toggleTask}
        />
      )}
    </div>
  );
}

export default App;

import TaskItem from './TaskItem';

// tasks = tableau de tâches reçu depuis App.jsx
// onDelete = fonction pour supprimer une tâche
// onToggle = fonction pour cocher/décocher une tâche
function TaskList({ tasks, onDelete, onToggle }) {

  // Si aucune tâche → affiche un message
  if (tasks.length === 0) {
    return <p>Aucune tâche pour le moment. Ajoutez-en une !</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {/* On parcourt le tableau et on crée un TaskItem pour chaque tâche */}
      {tasks.map(task => (
        <TaskItem
          // key obligatoire en React pour identifier chaque élément
          key={task._id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

export default TaskList;
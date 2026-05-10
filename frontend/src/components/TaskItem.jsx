// task = une seule tâche
// onDelete = fonction pour supprimer
// onToggle = fonction pour cocher/décocher
function TaskItem({ task, onDelete, onToggle }) {
  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px',
      margin: '8px 0',
      border: '1px solid #ddd',
      borderRadius: '8px',
      // Si terminee → texte barré
      textDecoration: task.terminee ? 'line-through' : 'none',
      opacity: task.terminee ? 0.6 : 1,
    }}>

      {/* Checkbox pour cocher/décocher la tâche */}
      <input
        type="checkbox"
        checked={task.terminee}
        // quand on coche → appelle onToggle avec l'ID et la nouvelle valeur
        onChange={() => onToggle(task._id, !task.terminee)}
      />

      {/* Titre de la tâche */}
      <span style={{ flex: 1 }}>{task.titre}</span>

      {/* Description si elle existe */}
      {task.description && (
        <small style={{ color: '#888' }}>{task.description}</small>
      )}

      {/* Bouton supprimer */}
      <button
        onClick={() => onDelete(task._id)}
        style={{ color: 'red', cursor: 'pointer' }}
      >
        Supprimer
      </button>

    </li>
  );
}

export default TaskItem;
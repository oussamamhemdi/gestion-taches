import { useState } from 'react';

// onAdd = fonction reçue depuis App.jsx
// quand on soumet le formulaire → on appelle onAdd avec les données
function TaskForm({ onAdd }) {

  // titre = valeur de l'input
  // setTitre = fonction pour modifier la valeur
  const [titre, setTitre] = useState('');

  const handleSubmit = (e) => {
    // Empêche le rechargement de la page
    // comportement par défaut d'un formulaire HTML
    e.preventDefault();

    // Si l'input est vide → on ne fait rien
    if (!titre.trim()) return;

    // On appelle onAdd avec les données de la tâche
    onAdd({ titre });

    // On vide l'input après soumission
    setTitre('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        // placeholder visible dans l'input quand il est vide
        placeholder="Nouvelle tâche..."
        // value contrôlé par le state React
        value={titre}
        // à chaque frappe → met à jour le state
        onChange={(e) => setTitre(e.target.value)}
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default TaskForm;
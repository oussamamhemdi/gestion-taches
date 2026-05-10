import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../components/TaskList';

// Données de test — fausses tâches pour les tests
const fakeTasks = [
  { _id: '1', titre: 'Tâche 1', terminee: false, description: '' },
  { _id: '2', titre: 'Tâche 2', terminee: true, description: '' },
];

describe('TaskList', () => {

  // Test 1 — affiche un message si aucune tâche
  it('affiche un message si la liste est vide', () => {
    render(
      <TaskList tasks={[]} onDelete={() => {}} onToggle={() => {}} />
    );

    expect(
      screen.getByText('Aucune tâche pour le moment. Ajoutez-en une !')
    ).toBeInTheDocument();
  });

  // Test 2 — affiche les tâches correctement
  it('affiche toutes les tâches', () => {
    render(
      <TaskList tasks={fakeTasks} onDelete={() => {}} onToggle={() => {}} />
    );

    expect(screen.getByText('Tâche 1')).toBeInTheDocument();
    expect(screen.getByText('Tâche 2')).toBeInTheDocument();
  });

  // Test 3 — appelle onDelete quand on clique Supprimer
  it('appelle onDelete avec le bon id', () => {
    const mockDelete = vi.fn();
    render(
      <TaskList tasks={fakeTasks} onDelete={mockDelete} onToggle={() => {}} />
    );

    // On clique sur le premier bouton Supprimer
    const deleteButtons = screen.getAllByText('Supprimer');
    fireEvent.click(deleteButtons[0]);

    // onDelete doit être appelé avec l'id de la première tâche
    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  // Test 4 — appelle onToggle quand on coche une tâche
  it('appelle onToggle quand on coche une tâche', () => {
    const mockToggle = vi.fn();
    render(
      <TaskList tasks={fakeTasks} onDelete={() => {}} onToggle={mockToggle} />
    );

    // On coche la première checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    // onToggle doit être appelé avec l'id et true
    expect(mockToggle).toHaveBeenCalledWith('1', true);
  });

});
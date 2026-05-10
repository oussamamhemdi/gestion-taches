import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {

  it('affiche un input et un bouton Ajouter', () => {
    render(<TaskForm onAdd={() => {}} />);

    expect(
      screen.getByPlaceholderText('Nouvelle tâche...')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Ajouter')
    ).toBeInTheDocument();
  });

  it('appelle onAdd avec le titre quand on soumet', () => {
    const mockAdd = vi.fn();
    render(<TaskForm onAdd={mockAdd} />);

    fireEvent.change(
      screen.getByPlaceholderText('Nouvelle tâche...'),
      { target: { value: 'Faire les courses' } }
    );

    fireEvent.click(screen.getByText('Ajouter'));

    expect(mockAdd).toHaveBeenCalledWith({ titre: 'Faire les courses' });
  });

  it('vide l\'input après soumission', () => {
    render(<TaskForm onAdd={vi.fn()} />);

    const input = screen.getByPlaceholderText('Nouvelle tâche...');

    fireEvent.change(input, { target: { value: 'Ma tâche' } });
    fireEvent.click(screen.getByText('Ajouter'));

    expect(input.value).toBe('');
  });

  it('ne soumet pas si le titre est vide', () => {
    const mockAdd = vi.fn();
    render(<TaskForm onAdd={mockAdd} />);

    fireEvent.click(screen.getByText('Ajouter'));

    expect(mockAdd).not.toHaveBeenCalled();
  });

});
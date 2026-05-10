import axios from 'axios';

// L'URL de base de notre API backend
// En développement → localhost:5000
// En production → l'URL Render (on changera ça au déploiement)
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Récupère toutes les tâches
// GET /api/tasks
export const getTasks = () => API.get('/tasks');

// Crée une nouvelle tâche
// POST /api/tasks
// data = { titre: "...", description: "..." }
export const createTask = (data) => API.post('/tasks', data);

// Modifie une tâche existante
// PUT /api/tasks/:id
// data = { terminee: true } par exemple
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);

// Supprime une tâche
// DELETE /api/tasks/:id
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
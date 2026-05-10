const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Task = require('../models/Task');

// ─────────────────────────────────────────
// CONFIGURATION AVANT/APRÈS LES TESTS
// ─────────────────────────────────────────

let server;

// beforeAll = s'exécute UNE FOIS avant tous les tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  // Port 0 = Node choisit un port aléatoire disponible
  // Évite les conflits avec le vrai serveur
  server = app.listen(0);
});

// afterAll = s'exécute UNE FOIS après tous les tests
afterAll(async () => {
  await mongoose.connection.close();
  // Ferme le serveur proprement après tous les tests
  server.close();
});

// afterEach = s'exécute après CHAQUE test
// Vide la collection pour que les tests soient indépendants
afterEach(async () => {
  await Task.deleteMany({});
});

// ─────────────────────────────────────────
// TESTS GET /api/tasks
// ─────────────────────────────────────────
describe('GET /api/tasks', () => {

  it('retourne un tableau vide si aucune tâche', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('retourne la liste des tâches', async () => {
    await Task.create({ titre: 'Tâche de test' });
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titre).toBe('Tâche de test');
  });

});

// ─────────────────────────────────────────
// TESTS POST /api/tasks
// ─────────────────────────────────────────
describe('POST /api/tasks', () => {

  it('crée une nouvelle tâche', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ titre: 'Nouvelle tâche', description: 'Ma description' });
    expect(res.statusCode).toBe(201);
    expect(res.body.titre).toBe('Nouvelle tâche');
    expect(res.body._id).toBeDefined();
    expect(res.body.terminee).toBe(false);
  });

  it('retourne une erreur 400 si le titre est manquant', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'Sans titre !' });
    expect(res.statusCode).toBe(400);
    expect(res.body.erreur).toBeDefined();
  });

});

// ─────────────────────────────────────────
// TESTS PUT /api/tasks/:id
// ─────────────────────────────────────────
describe('PUT /api/tasks/:id', () => {

  it('modifie une tâche existante', async () => {
    const task = await Task.create({ titre: 'Tâche à modifier' });
    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ terminee: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.terminee).toBe(true);
  });

  it('retourne 404 si la tâche n\'existe pas', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/tasks/${fakeId}`)
      .send({ terminee: true });
    expect(res.statusCode).toBe(404);
  });

});

// ─────────────────────────────────────────
// TESTS DELETE /api/tasks/:id
// ─────────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {

  it('supprime une tâche existante', async () => {
    const task = await Task.create({ titre: 'Tâche à supprimer' });
    const res = await request(app)
      .delete(`/api/tasks/${task._id}`);
    expect(res.statusCode).toBe(204);
    const taskInDb = await Task.findById(task._id);
    expect(taskInDb).toBeNull();
  });

  it('retourne 404 si la tâche n\'existe pas', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/tasks/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

});
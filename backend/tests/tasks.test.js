const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Task = require('../models/Task');

// ─────────────────────────────────────────
// CONFIGURATION AVANT/APRÈS LES TESTS
// ─────────────────────────────────────────

// beforeAll = s'exécute UNE FOIS avant tous les tests
// On se connecte à MongoDB avant de commencer
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// afterAll = s'exécute UNE FOIS après tous les tests
// On ferme la connexion MongoDB proprement
afterAll(async () => {
  await mongoose.connection.close();
});

// afterEach = s'exécute après CHAQUE test
// On vide la collection tasks pour que les tests soient indépendants
// Un test ne doit jamais dépendre des données d'un autre test !
afterEach(async () => {
  await Task.deleteMany({});
});

// ─────────────────────────────────────────
// TESTS GET /api/tasks
// ─────────────────────────────────────────
describe('GET /api/tasks', () => {

  // Test 1 : retourne un tableau vide au départ
  it('retourne un tableau vide si aucune tâche', async () => {
    const res = await request(app).get('/api/tasks');

    // On vérifie que le code HTTP est 200
    expect(res.statusCode).toBe(200);

    // On vérifie que la réponse est un tableau vide
    expect(res.body).toEqual([]);
  });

  // Test 2 : retourne les tâches existantes
  it('retourne la liste des tâches', async () => {
    // On crée une tâche directement en base pour le test
    await Task.create({ titre: 'Tâche de test' });

    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    // On vérifie qu'il y a bien 1 tâche dans le tableau
    expect(res.body.length).toBe(1);
    // On vérifie que le titre est correct
    expect(res.body[0].titre).toBe('Tâche de test');
  });

});

// ─────────────────────────────────────────
// TESTS POST /api/tasks
// ─────────────────────────────────────────
describe('POST /api/tasks', () => {

  // Test 3 : crée une tâche avec succès
  it('crée une nouvelle tâche', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ titre: 'Nouvelle tâche', description: 'Ma description' });

    // 201 = Created
    expect(res.statusCode).toBe(201);
    // On vérifie que la tâche a bien le titre envoyé
    expect(res.body.titre).toBe('Nouvelle tâche');
    // On vérifie que MongoDB a généré un _id
    expect(res.body._id).toBeDefined();
    // Par défaut terminee doit être false
    expect(res.body.terminee).toBe(false);
  });

  // Test 4 : échoue si le titre est manquant
  it('retourne une erreur 400 si le titre est manquant', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'Sans titre !' });

    // 400 = Bad Request
    expect(res.statusCode).toBe(400);
    // On vérifie qu'il y a un message d'erreur
    expect(res.body.erreur).toBeDefined();
  });

});

// ─────────────────────────────────────────
// TESTS PUT /api/tasks/:id
// ─────────────────────────────────────────
describe('PUT /api/tasks/:id', () => {

  // Test 5 : modifie une tâche avec succès
  it('modifie une tâche existante', async () => {
    // On crée une tâche pour le test
    const task = await Task.create({ titre: 'Tâche à modifier' });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ terminee: true });

    expect(res.statusCode).toBe(200);
    // On vérifie que terminee est maintenant true
    expect(res.body.terminee).toBe(true);
  });

  // Test 6 : retourne 404 si l'ID n'existe pas
  it('retourne 404 si la tâche n\'existe pas', async () => {
    // On génère un ID MongoDB valide mais inexistant
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

  // Test 7 : supprime une tâche avec succès
  it('supprime une tâche existante', async () => {
    const task = await Task.create({ titre: 'Tâche à supprimer' });

    const res = await request(app)
      .delete(`/api/tasks/${task._id}`);

    // 204 = No Content (suppression réussie)
    expect(res.statusCode).toBe(204);

    // On vérifie que la tâche n'existe plus en base
    const taskInDb = await Task.findById(task._id);
    expect(taskInDb).toBeNull();
  });

  // Test 8 : retourne 404 si l'ID n'existe pas
  it('retourne 404 si la tâche n\'existe pas', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/tasks/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

});
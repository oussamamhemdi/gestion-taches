// On importe le modèle Task qu'on vient de créer
const Task = require('../models/Task');

// ─────────────────────────────────────────
// GET /api/tasks — Récupère toutes les tâches
// ─────────────────────────────────────────
exports.getAllTasks = async (req, res) => {
  try {
    // .find() sans argument = récupère TOUT
    // .sort({ dateCreation: -1 }) = les plus récentes en premier
    const tasks = await Task.find().sort({ dateCreation: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};

// ─────────────────────────────────────────
// POST /api/tasks — Crée une nouvelle tâche
// ─────────────────────────────────────────
exports.createTask = async (req, res) => {
  try {
    // req.body contient les données envoyées par le client
    // ex: { titre: "Faire les courses", description: "..." }
    const newTask = new Task(req.body);

    // .save() enregistre la tâche dans MongoDB
    await newTask.save();

    // 201 = "Created" — c'est le bon code HTTP pour une création
    res.status(201).json(newTask);
  } catch (err) {
    // 400 = "Bad Request" — ex: titre manquant
    res.status(400).json({ erreur: err.message });
  }
};

// ─────────────────────────────────────────
// PUT /api/tasks/:id — Modifie une tâche
// ─────────────────────────────────────────
exports.updateTask = async (req, res) => {
  try {
    // req.params.id = l'ID dans l'URL ex: /api/tasks/64abc123
    // { new: true } = retourne la tâche APRÈS modification (pas avant)
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    // Si l'ID n'existe pas dans MongoDB
    if (!task) {
      return res.status(404).json({ erreur: 'Tâche non trouvée' });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
};

// ─────────────────────────────────────────
// DELETE /api/tasks/:id — Supprime une tâche
// ─────────────────────────────────────────
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    // Si l'ID n'existe pas
    if (!task) {
      return res.status(404).json({ erreur: 'Tâche non trouvée' });
    }

    // 204 = "No Content" — succès mais pas de données à renvoyer
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};
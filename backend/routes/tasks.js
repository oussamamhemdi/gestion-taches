// On importe Express pour créer un routeur
const express = require('express');

// Un routeur c'est comme une mini-application Express
// Il gère un groupe de routes liées au même sujet (ici : les tâches)
const router = express.Router();

// On importe toutes les fonctions du contrôleur
const taskController = require('../controllers/taskController');

// ─────────────────────────────────────────
// GET /api/tasks → récupère toutes les tâches
// ─────────────────────────────────────────
router.get('/', taskController.getAllTasks);

// ─────────────────────────────────────────
// POST /api/tasks → crée une nouvelle tâche
// ─────────────────────────────────────────
router.post('/', taskController.createTask);

// ─────────────────────────────────────────
// PUT /api/tasks/:id → modifie une tâche
// ----------------------------------------

router.put('/:id', taskController.updateTask);

// ─────────────────────────────────────────
// DELETE /api/tasks/:id → supprime une tâche
// ─────────────────────────────────────────
router.delete('/:id', taskController.deleteTask);

// On exporte le routeur pour l'utiliser dans server.js
module.exports = router;
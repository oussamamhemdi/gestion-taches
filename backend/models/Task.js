// On importe Mongoose — c'est lui qui fait le lien entre Node.js et MongoDB
const mongoose = require('mongoose');

// On définit le "schéma" — la structure d'une tâche
const taskSchema = new mongoose.Schema({

  // Le titre est obligatoire (required: true)
  // Si on essaie de créer une tâche sans titre → erreur automatique
  titre: {
    type: String,
    required: true
  },

  // La description est optionnelle — par défaut c'est une chaîne vide
  description: {
    type: String,
    default: ''
  },

  // terminee indique si la tâche est faite ou non
  // Par défaut false — une nouvelle tâche n'est pas encore terminée
  terminee: {
    type: Boolean,
    default: false
  },

  // La date limite pour faire la tâche — optionnelle
  dateEcheance: {
    type: Date,
    default: null
  },

  // La date de création — remplie automatiquement par MongoDB
  dateCreation: {
    type: Date,
    default: Date.now
  }

});

// On crée le modèle "Task" à partir du schéma
// Mongoose va automatiquement créer une collection "tasks" dans MongoDB
module.exports = mongoose.model('Task', taskSchema);
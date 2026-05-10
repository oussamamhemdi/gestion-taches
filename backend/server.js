
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const taskRoutes = require('./routes/tasks');


const app = express();


app.use(cors());

app.use(express.json());




mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    
    console.log('✅ MongoDB connecté !');
  })
  .catch((err) => {
    
    console.log('❌ Erreur MongoDB :', err.message);
  });

app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.json({ message: '🚀 API Gestion de Tâches fonctionne !' });
});
if (require.main === module) {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend démarré sur le port ${PORT}`);
  });
}


module.exports = app;
const mongoose = require('mongoose');

const schemaTarefa = new mongoose.Schema({
  descricao: {
    required: true,
    type: String
  },
  statusRealizada: {
    required: true,
    type: Boolean
  }
}, {
  versionKey: false  // Remove o __v do MongoDB
});

// Força o nome da coleção como 'tarefas' (sem plural automático)
module.exports = mongoose.model('Tarefa', schemaTarefa, 'tarefas');

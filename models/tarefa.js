const mongoose = require('mongoose');

const schemaTarefa = new mongoose.Schema({
  descricao: {
    required: true,
    type: String
  },
  statusRealizada: {
    required: true,
    type: Boolean,
    default: false  // Valor padrão
  }
}, {
  timestamps: true,  // Adiciona createdAt e updatedAt
  versionKey: false   // Remove o campo __v
});
 
// Exporta o modelo
module.exports = mongoose.model('Tarefa', schemaTarefa);

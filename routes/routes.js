const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');

// GET all tarefas
router.get('/getAll', async (req, res) => {
  console.log('📋 GET /getAll - Buscando tarefas...');
  try {
    const resultados = await modeloTarefa.find();
    console.log(`✅ Encontradas ${resultados.length} tarefas`);
    res.json(resultados);
  } catch (error) {
    console.error('❌ Erro no GET:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// POST criar tarefa
router.post('/post', async (req, res) => {
  console.log('📝 POST /post - Recebendo:', req.body);
  
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada
  });
  
  try {
    const tarefaSalva = await objetoTarefa.save();
    console.log('✅ Tarefa salva com ID:', tarefaSalva._id);
    res.status(200).json(tarefaSalva);
  } catch (error) {
    console.error('❌ Erro ao salvar:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// DELETE tarefa
router.delete('/delete/:id', async (req, res) => {
  console.log('🗑️ DELETE /delete/', req.params.id);
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    console.log('✅ Tarefa removida:', resultado ? 'Sim' : 'Não encontrada');
    res.json(resultado);
  } catch (error) {
    console.error('❌ Erro no DELETE:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// PATCH atualizar tarefa
router.patch('/update/:id', async (req, res) => {
  console.log('✏️ PATCH /update/', req.params.id, req.body);
  try {
    const id = req.params.id;
    const novaTarefa = req.body;
    const options = { new: true };
    const result = await modeloTarefa.findByIdAndUpdate(id, novaTarefa, options);
    console.log('✅ Tarefa atualizada:', result ? 'Sim' : 'Não encontrada');
    res.json(result);
  } catch (error) {
    console.error('❌ Erro no UPDATE:', error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

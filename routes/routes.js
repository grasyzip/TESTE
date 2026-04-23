const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');

// GET all tarefas
router.get('/getAll', async (req, res) => {
  try {
    const resultados = await modeloTarefa.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST criar tarefa
router.post('/post', async (req, res) => {
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada
  });
  
  try {
    const tarefaSalva = await objetoTarefa.save();
    res.status(200).json(tarefaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE tarefa
router.delete('/delete/:id', async (req, res) => {
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH atualizar tarefa (VERSÃO CORRIGIDA - SEM WARNING)
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const novaTarefa = req.body;
    // Corrigido: usando returnDocument: 'after' em vez de new: true
    const result = await modeloTarefa.findByIdAndUpdate(
      id, 
      novaTarefa, 
      { returnDocument: 'after' }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

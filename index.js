const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

const PORT = process.env.PORT || 3000;
const routes = require('./routes/routes');
app.use('/api', routes);

// ⭐ CRUCIAL: Railway usa MONGO_URL (não MONGODB_URL)
const mongoURL = process.env.MONGO_URL;

console.log('=== DIAGNÓSTICO ===');
console.log('PORT:', PORT);
console.log('MONGO_URL existe?', mongoURL ? '✅ SIM' : '❌ NÃO');
console.log('Todas variáveis com MONGO:', Object.keys(process.env).filter(k => k.includes('MONGO')));

if (!mongoURL) {
  console.error('❌ ERRO: MONGO_URL não encontrada!');
  console.error('Por favor, adicione a referência do MongoDB no serviço Node.js');
  process.exit(1);
}

console.log('🔄 Conectando ao MongoDB...');

mongoose.connect(mongoURL)
  .then(() => {
    console.log('✅ MongoDB conectado com sucesso!');
  })
  .catch((err) => {
    console.error('❌ Erro detalhado:', err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

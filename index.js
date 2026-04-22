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

// Importa as rotas
const routes = require('./routes/routes');
app.use('/api', routes);

// Conexão com MongoDB
const mongoURL = process.env.MONGO_URL || process.env.MONGODB_URL;

console.log('🔍 Iniciando servidor...');
console.log('📦 MONGO_URL configurada?', mongoURL ? '✅ SIM' : '❌ NÃO');

if (!mongoURL) {
  console.error('❌ ERRO: MONGO_URL não encontrada!');
  process.exit(1);
}

mongoose.connect(mongoURL)
  .then(() => {
    console.log('✅ MongoDB conectado com sucesso!');
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API disponível em: https://passionate-simplicity-production-0313.up.railway.app/api/getAll`);
});

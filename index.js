const express = require('express');
const app = express();
const mongoose = require('mongoose');

// CORS
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

// CONEXÃO COM MONGODB
const mongoURL = process.env.MONGO_URL || process.env.MONGODB_URL;

console.log('🚀 Iniciando servidor...');
console.log('📦 Variável MONGO_URL:', mongoURL ? '✅ CONFIGURADA' : '❌ NÃO CONFIGURADA');

if (!mongoURL) {
  console.error('❌ ERRO: MONGO_URL não encontrada nas variáveis de ambiente!');
  console.error('Por favor, configure a variável MONGO_URL no Railway');
  process.exit(1);
}

// Função para conectar ao MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
    });
    console.log('✅ MongoDB conectado com sucesso!');
    
    // Testa se consegue escrever no banco
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📚 Coleções disponíveis:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    console.error('Verifique se a URL do MongoDB está correta');
    process.exit(1);
  }
}

// Conecta ao MongoDB antes de iniciar o servidor
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 API URL: https://passionate-simplicity-production-0313.up.railway.app`);
  });
});

// Tratamento de erros após conectar
mongoose.connection.on('error', (err) => {
  console.error('❌ Erro no MongoDB após conexão:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado. Tentando reconectar...');
});

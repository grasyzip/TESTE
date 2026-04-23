const express = require('express');
const app = express();
const mongoose = require('mongoose');

// ==================== CONFIGURAÇÃO CORS ====================
// Esta é a parte mais importante - resolve o erro do Vercel
app.use((req, res, next) => {
  // Lista de origens permitidas (seus frontends)
  const allowedOrigins = [
    'https://todoteste.vercel.app',     // ← SEU SITE NO VERCEL
    'http://localhost:4200',             // Desenvolvimento local Angular
    'http://localhost:3000'              // Teste local
  ];
  
  const origin = req.headers.origin;
  
  // Verifica se a origem está na lista permitida
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Para desenvolvimento, permite qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // Métodos HTTP permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  
  // Headers permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Permite enviar cookies/credenciais
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Responde imediatamente às requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'CORS preflight OK' });
  }
  
  next();
});
// ============================================================

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Importa as rotas
const routes = require('./routes/routes');
app.use('/api', routes);

// Rota raiz para teste
app.get('/', (req, res) => {
  res.json({
    message: 'API Todo List está funcionando!',
    cors: 'Configurado para Vercel',
    endpoints: {
      getAll: '/api/getAll',
      create: '/api/post',
      delete: '/api/delete/:id',
      update: '/api/update/:id'
    }
  });
});

// Conexão MongoDB
const mongoURL = process.env.MONGO_URL || process.env.MONGODB_URL;

console.log('🚀 Iniciando servidor...');
console.log('📦 MongoDB:', mongoURL ? '✅ Configurada' : '❌ Não configurada');

if (!mongoURL) {
  console.error('❌ ERRO: MONGO_URL não encontrada');
  process.exit(1);
}

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURL);
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
}

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 API: https://passionate-simplicity-production-0313.up.railway.app`);
    console.log(`✅ CORS liberado para: https://todoteste.vercel.app`);
  });
});

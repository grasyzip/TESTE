const express = require('express');
const app = express();
const mongoose = require('mongoose');

// ==================== CORS CONFIGURADO CORRETAMENTE ====================
app.use((req, res, next) => {
  // Permite qualquer origem (para testes) - EM PRODUÇÃO, RESTRIJA PARA SEU DOMÍNIO
  const allowedOrigins = [
    'https://todo-list-seven-delta-66.vercel.app',  // ← SUBSTITUA PELA URL DO SEU FRONTEND NO VERCEL
    'http://localhost:4200',            // Para desenvolvimento local
    'http://localhost:3000'             // Para testes locais
  ];
  
  const origin = req.headers.origin;
  
  // Permite a origem se estiver na lista OU usa * para desenvolvimento
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Remove em produção
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Responde preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
// ========================================================================

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Importa as rotas
const routes = require('./routes/routes');
app.use('/api', routes);

// Rota de teste para a raiz (resolve o erro 404)
app.get('/', (req, res) => {
  res.json({
    message: 'API Todo List está funcionando!',
    endpoints: {
      getAll: '/api/getAll',
      create: '/api/post',
      delete: '/api/delete/:id',
      update: '/api/update/:id'
    },
    status: 'online',
    timestamp: new Date()
  });
});

// CONEXÃO COM MONGODB
const mongoURL = process.env.MONGO_URL || process.env.MONGODB_URL;

console.log('Iniciando servidor...');
console.log('Variável MONGO_URL:', mongoURL ? '✅ CONFIGURADA' : '❌ NÃO CONFIGURADA');

if (!mongoURL) {
  console.error('❌ ERRO: MONGO_URL não encontrada nas variáveis de ambiente!');
  console.error('Por favor, configure a variável MONGO_URL no Railway');
  process.exit(1);
}

// Função para conectar ao MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB conectado com sucesso!');
    
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
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`API disponível em: /api/getAll`);
    console.log(`Home: https://passionate-simplicity-production-0313.up.railway.app`);
  });
});

// Tratamento de erros após conectar
mongoose.connection.on('error', (err) => {
  console.error('❌ Erro no MongoDB após conexão:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado. Tentando reconectar...');
});

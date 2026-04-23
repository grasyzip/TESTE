const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tarefaRoutes = require('./routes/tarefaRoutes');

const app = express();

// ✅ CONFIGURAÇÃO CORS CORRETA (SUBSTITUA TUDO)
app.use(cors({
  origin: [
    'https://todoteste.vercel.app',
    'https://todoteste-91msx271t-yyarczip-2758s-projects.vercel.app',
    'http://localhost:4200' // Para desenvolvimento local
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control',  // ← ESSE É O HEADER QUE ESTÁ FALTANDO
    'Pragma',
    'Expires'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Se quiser permitir todas as origens (mais simples para teste):
// app.use(cors()); // Isso permite tudo, mas menos seguro

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Suas rotas
app.use('/api', tarefaRoutes);
// ========================================================================
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

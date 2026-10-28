require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Importação das rotas e middlewares
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middlewares/authMiddleware');
const authorizeRole = require('./middlewares/roleMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// registo das rotas publicas de autenticação
app.use('/api/auth', authRoutes);

// rota de teste pública
app.get('/', (req, res) => {
    res.json({ message: 'API OficinaFlux ativa e operando.' });
});

// rota de teste protegida pelo token e papel atendente por enquanto
app.get('/api/teste-atendente', verifyToken, authorizeRole('atendente'), (req, res) => {
    res.json({ 
        mensagem: 'Acesso autorizado para a rota de Atendente!',
        dadosUsuarioLogado: req.usuario 
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    try {
        await db.query('SELECT 1');
        console.log('Conexão com o MySQL realizada com sucesso!');
    } catch (err) {
        console.error('Falha ao conectar no MySQL. Verifique seu arquivo .env');
    }
});
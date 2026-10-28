const jwt = require('jsonwebtoken');

// verificar o token JWT valido
const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    // divide a string pelo espaço e extrai apenas o token se existir
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado! Token de autenticação não fornecido.' });
    }

    try {
        // valida se o token esta com chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // guarda as informações do utilizador descodificadas (id, nome, papel) dentro de req.usuario
        req.usuario = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ mensagem: 'Token inválido ou expirado!' });
    }
};

module.exports = verifyToken;
const authorizeRole = (...papeisPermitidos) => {
    return (req, res, next) => {
        // injetado pelo verifyToken
        if (!req.usuario || !papeisPermitidos.includes(req.usuario.papel)) {
            return res.status(403).json({ 
                mensagem: `Acesso proibido! Esta ação requer um dos seguintes perfis: ${papeisPermitidos.join(', ')}.` 
            });
        }
        
        // autoriza se o papel estiver na lista permitida
        next();
    };
};

module.exports = authorizeRole;
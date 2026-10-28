const jwt = require('jsonwebtoken');

const createUserToken = async (user, res) => {
    const token = jwt.sign(
        {
            id: user.id,
            nome: user.nome,
            papel: user.papel 
        },
        process.env.JWT_SECRET
    );

    return res.status(200).json({
        mensagem: 'Autenticado com sucesso!',
        token: token,
        usuario: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            papel: user.papel
        }
    });
};

module.exports = createUserToken;
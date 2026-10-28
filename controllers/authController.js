const User = require('../models/User');
const createUserToken = require('../helpers/createUserToken');

class AuthController {
    // registrar um novo usuario
    static async register(req, res) {
        const { nome, email, senha, confirmaSenha, papel, telefone } = req.body;

        // validações presença de dados
        if (!nome || !email || !senha || !papel) {
            return res.status(422).json({ mensagem: 'Os campos nome, email, senha e papel são obrigatórios!' });
        }

        if (senha !== confirmaSenha) {
            return res.status(422).json({ mensagem: 'A confirmação de senha não confere!' });
        }

        // validação dos papéis
        const papeisValidos = ['cliente', 'mecanico', 'orcamentista', 'atendente'];
        if (!papeisValidos.includes(papel)) {
            return res.status(422).json({ mensagem: 'Papel inválido informado.' });
        }

        try {
            // verifica se o e-mail esta cadastrado
            const usuarioExistente = await User.findByEmail(email);
            if (usuarioExistente) {
                return res.status(422).json({ mensagem: 'Este e-mail já está em uso!' });
            }

            // criação do usuario
            const novoUsuario = await User.create({ nome, email, senha, papel, telefone });

            // gera o token e responde
            await createUserToken(novoUsuario, res);

        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ mensagem: 'Erro interno no servidor ao registrar usuário.' });
        }
    }

    // endpoint de Login
    static async login(req, res) {
        const { email, senha } = req.body;

        // validação de campos
        if (!email || !senha) {
            return res.status(422).json({ mensagem: 'E-mail e senha são obrigatórios!' });
        }

        try {
            // busca o usuário
            const usuario = await User.findByEmail(email);
            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não cadastrado com este e-mail!' });
            }

            // validação da senha
            const senhaValida = await usuario.checkPassword(senha);
            if (!senhaValida) {
                return res.status(401).json({ mensagem: 'Senha incorreta!' });
            }

            await createUserToken(usuario, res);

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ mensagem: 'Erro interno no servidor ao realizar login.' });
        }
    }
}

module.exports = AuthController;
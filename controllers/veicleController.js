const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

class VehicleController {
    static async register(req, res) {
        const { cliente_id, placa, modelo, marca, ano } = req.body;

        if (!cliente_id || !placa || !modelo || !marca || !ano) {
            return res.status(422).json({ mensagem: 'Todos os campos do veículo são obrigatórios!' });
        }

        try {
            // verifica se o ID informado pertence a um cliente
            const cliente = await User.findById(cliente_id);
            if (!cliente || cliente.papel !== 'cliente') {
                return res.status(404).json({ mensagem: 'Cliente não encontrado ou usuário não possui papel de cliente.' });
            }

            // verifica se a placa já existe
            const veiculoExistente = await Vehicle.findByPlate(placa);
            if (veiculoExistente) {
                return res.status(422).json({ mensagem: 'Já existe um veículo cadastrado com esta placa!' });
            }

            const novoVeiculo = await Vehicle.create({ cliente_id, placa, modelo, marca, ano });

            return res.status(201).json({
                mensagem: 'Veículo cadastrado com sucesso!',
                veiculo: novoVeiculo
            });

        } catch (error) {
            console.error('Erro ao cadastrar veículo:', error);
            res.status(500).json({ mensagem: 'Erro interno no servidor ao registrar veículo.' });
        }
    }
}

module.exports = VehicleController;
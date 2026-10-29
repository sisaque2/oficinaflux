const Attendance = require('../models/Atendimento');

class AttendanceController {
    static async create(req, res) {
        const { veiculo_id, relato_problema } = req.body;
        
        const cliente_id = req.usuario.id;

        if (!veiculo_id || !relato_problema) {
            return res.status(422).json({ mensagem: 'O veículo e o relato do problema são obrigatórios!' });
        }

        try {
            const novoAtendimento = await Attendance.create({
                veiculo_id,
                cliente_id,
                relato_problema
            });

            return res.status(201).json({
                mensagem: 'Atendimento aberto com sucesso na fila da oficina!',
                atendimento: novoAtendimento
            });

        } catch (error) {
            console.error('Erro ao abrir atendimento:', error);
            res.status(500).json({ mensagem: 'Erro interno ao abrir atendimento.' });
        }
    }

    static async getMyAttendances(req, res) {
        try {
            const atendimentos = await Attendance.findByClientId(req.usuario.id);
            return res.status(200).json({ atendimentos });
        } catch (error) {
            console.error('Erro ao listar atendimentos:', error);
            res.status(500).json({ mensagem: 'Erro ao buscar atendimentos.' });
        }
    }
}

module.exports = AttendanceController;
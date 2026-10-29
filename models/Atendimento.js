const db = require('../config/db');

class Atendimento {
    constructor(id, veiculo_id, cliente_id, relato_problema, lista_servicos_pecas, valor_orcamento, status) {
        this.id = id;
        this.veiculo_id = veiculo_id;
        this.cliente_id = cliente_id;
        this.relato_problema = relato_problema;
        this.lista_servicos_pecas = lista_servicos_pecas;
        this.valor_orcamento = valor_orcamento;
        this.status = status;
    }

    // cliente abre o chamado relatando a avaria
    static async create(dadosAtendimento) {
        const sql = `
            INSERT INTO atendimentos (veiculo_id, cliente_id, relato_problema, status) 
            VALUES (?, ?, ?, 'fila')
        `;
        const params = [
            dadosAtendimento.veiculo_id,
            dadosAtendimento.cliente_id,
            dadosAtendimento.relato_problema
        ];

        const result = await db.query(sql, params);
        return new Atendimento(
            result.insertId,
            dadosAtendimento.veiculo_id,
            dadosAtendimento.cliente_id,
            dadosAtendimento.relato_problema,
            null,
            0.00,
            'fila'
        );
    }

    // Lista atendimentos pelo ID do cliente logado
    static async findByClientId(cliente_id) {
        const sql = `
            SELECT a.*, v.placa, v.modelo 
            FROM atendimentos a 
            JOIN veiculos v ON a.veiculo_id = v.id 
            WHERE a.cliente_id = ?
        `;
        return await db.query(sql, [cliente_id]);
    }
}

module.exports = Atendimento;
const db = require('../config/db');

class Veicle {
    constructor(id, cliente_id, placa, modelo, marca, ano) {
        this.id = id;
        this.cliente_id = cliente_id;
        this.placa = placa;
        this.modelo = modelo;
        this.marca = marca;
        this.ano = ano;
    }

    // cadastro de veículo
    static async create(dadosVeiculo) {
        const sql = `
            INSERT INTO veiculos (cliente_id, placa, modelo, marca, ano) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            dadosVeiculo.cliente_id,
            dadosVeiculo.placa.toUpperCase(),
            dadosVeiculo.modelo,
            dadosVeiculo.marca,
            dadosVeiculo.ano
        ];

        const result = await db.query(sql, params);
        return new Veicle(
            result.insertId,
            dadosVeiculo.cliente_id,
            dadosVeiculo.placa.toUpperCase(),
            dadosVeiculo.modelo,
            dadosVeiculo.marca,
            dadosVeiculo.ano
        );
    }

    // busca de veículo por placa
    static async findByPlate(placa) {
        const sql = 'SELECT * FROM veiculos WHERE placa = ?';
        const results = await db.query(sql, [placa.toUpperCase()]);
        if (results.length === 0) return null;

        const row = results[0];
        return new Veicle(row.id, row.cliente_id, row.placa, row.modelo, row.marca, row.ano);
    }

    // busca de veículos por cliente
    static async findByClientId(cliente_id) {
        const sql = 'SELECT * FROM veiculos WHERE cliente_id = ?';
        const results = await db.query(sql, [cliente_id]);
        return results.map(row => new Veicle(row.id, row.cliente_id, row.placa, row.modelo, row.marca, row.ano));
    }
}

module.exports = Veicle;
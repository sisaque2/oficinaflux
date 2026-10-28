const db = require('../config/db');
const bcrypt = require('bcrypt'); 

class User {
    constructor(id, nome, email, senha, papel, telefone = null) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.papel = papel;
        this.telefone = telefone;
    }

    // metodo para buscar um usuario pelo email
    static async findByEmail(email) {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const results = await db.query(sql, [email]);
        
        if (results.length === 0) {
            return null;
        }

        const row = results[0];

        return new User(row.id, row.nome, row.email, row.senha, row.papel, row.telefone);
    }

    // meodo para buscar o usuário pelo ID
    static async findById(id) {
        const sql = 'SELECT id, nome, email, papel, telefone, criado_em FROM usuarios WHERE id = ?';
        const results = await db.query(sql, [id]);

        if (results.length === 0) {
            return null;
        }

        const row = results[0];
        return new User(row.id, row.nome, row.email, null, row.papel, row.telefone);
    }

    // metodo para criar um novo usuario
    static async create(userData) {

        const salt = await bcrypt.genSalt(10);

        const senhaHash = await bcrypt.hash(userData.senha, salt);

        const sql = `
            INSERT INTO usuarios (nome, email, senha, papel, telefone) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            userData.nome,
            userData.email,
            senhaHash,
            userData.papel,
            userData.telefone || null
        ];

        const result = await db.query(sql, params);

        return new User(result.insertId, userData.nome, userData.email, senhaHash, userData.papel, userData.telefone);
    }

    async checkPassword(senhaDigitada) {

        return await bcrypt.compare(senhaDigitada, this.senha);
    }
}

module.exports = User;
const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    // metodo para executar queries
    async query(sql, params) {
        try {
            const [results] = await this.pool.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Erro na execução da query:', error.message);
            throw error;
        }
    }
}

// exporta uma instancia para usar
const db = new Database();
module.exports = db;
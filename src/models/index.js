const { pool } = require('../config/database');

class WeatherModel {
    static async criar(cidade, temperatura, descricao, data) {
        const dados = [cidade, temperatura, descricao, data];
        const consulta = `INSERT INTO previsao_tempo (cidade, temperatura, descricao, data) VALUES ($1, $2, $3, $4) RETURNING *`;
        const novaPrevisao = await pool.query(consulta, dados);
        return novaPrevisao.rows;
    }

    static async editar(id, cidade, temperatura, descricao, data) {
        const dados = [id, cidade, temperatura, descricao, data];
        const consulta = `UPDATE previsao_tempo SET cidade = $2, temperatura = $3, descricao = $4, data = $5 WHERE id = $1 RETURNING *`;
        const previsaoAtualizada = await pool.query(consulta, dados);
        return previsaoAtualizada.rows;
    }

    static async listar() {
        const consulta = `SELECT * FROM previsao_tempo`;
        const previsoes = await pool.query(consulta);
        return previsoes.rows;
    }

    static async listarPorCidade(cidade) {
        const dados = [cidade];
        const consulta = `SELECT * FROM previsao_tempo WHERE cidade = $1 ORDER BY data DESC LIMIT 1`;
        const previsoes = await pool.query(consulta, dados);
        return previsoes.rows;
    }

    static async listarPorData(data) {
        const dados = [data];
        const consulta = `SELECT * FROM previsao_tempo WHERE data = $1`;
        const previsoes = await pool.query(consulta, dados);
        return previsoes.rows;
    }

    static async previsaoRecente(cidade, limiteHoras = 1) {
        const dados = [cidade, limiteHoras];
        const consulta = `SELECT * FROM previsao_tempo WHERE cidade = $1 AND data >= NOW() - INTERVAL '$2 hours' ORDER BY data DESC LIMIT 1`;
        const previsoes = await pool.query(consulta, dados);
        return previsoes.rows.length ? previsoes.rows[0] : null;
    }

    static async excluirPrevisoesAntigas(limiteHoras = 1) {
        const consulta = `DELETE FROM previsao_tempo WHERE data < NOW() - INTERVAL '$1 hours'`;
        await pool.query(consulta, [limiteHoras]);
    }

    static async excluirTodos() {
        const consulta = `DELETE FROM previsao_tempo`;
        await pool.query(consulta);
    }
}

module.exports = WeatherModel;

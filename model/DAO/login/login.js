/*************************************************************************************
 * Objetivo: Arquivo responsável pelo acesso a dados do login (autenticacao do usuario)
 * Data: 2026/10/02
 * Autor: Matheus Lucas
 * Versão: 1.0
 
 *************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

// Busca o usuario pelo email, ja trazendo o nome do nivel de acesso e do status
// da conta prontos (usa a view_usuario_completo, em vez de fazer os joins aqui).
// Usa binding (?) em vez de interpolacao de string, para evitar SQL injection.
const selectUsuarioPorEmail = async function (email) {
    try {

        let sql = `select * from view_usuario_completo where email = ?;`

        let result = await knexConection.raw(sql, [email])

        if (Array.isArray(result[0])) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

module.exports = {
    selectUsuarioPorEmail
}
/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status do funcionario
 * Data: 2026/10/02
 * Autor: Nathan Luna
 * Versão: 1.0
 *************************************************************************************/

// inporta a biblioteca do knex
const knex = require('knex')

//inporta o arquivo de configuração do banco de dados 
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// cria a conexão a com banco de dados comforme o arquivo de comfiguração
const knexConection = knex(knexDataBaseConfig.development)

const insertStatusFuncionario = async function(dados){
    try {
        let sql = `
                        insert into tbl_status_funcionario (
                        status
                        ) values(
                         '${dados.status}'
                         );`

        let result = await knexConection.raw(sql)
        
        if(result)
            return result[0].insertId
        else
            return false

    } catch (error) {
        return false
    }
}

const updateStatusUsuario = async function(dados){
    try {
        
        let sql = `update tbl_status_funcionario set
                    status = "${dados.status}"
                    where id = ${dados.id}
                    ;`

        let result = await knexConection.raw(sql)
        
        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}
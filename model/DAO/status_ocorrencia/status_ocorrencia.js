/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da ocorrência
 * Data: 2026/10/07
 * Autor: Estephano Borovicz
 * Versão: 1.0
 *************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertStatusOcorrencia = async function(dados) {
    try {
        
        let sql = `insert into tbl_status_ocorrencia(
                        status
                    )values(
                        "${dados.status}"
                    );`
        
        let result = await knexConection.raw(sql)

        if(result){
            return result[0].insertId
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

const updateStatusOcorrencia = async function(dados) {
    try {
        
        let sql = `update tbl_status_ocorrencia set
                        status = "${dados.status}"
                        where id = ${dados.id};`
        
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllStatusOcorrencia = async function() {
    try {
        
        let sql = `select * from tbl_status_ocorrencia order by id desc;`

        let result = await knexConection.raw(sql)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

const selectByIdStatusOcorrencia = async function(id) {
    try {
        
        let sql = `select * from tbl_status_ocorrencia where id = ${id};`

        let result = await knexConection.raw(sql)

        if(result){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

const deleteStatusOcorrencia = async function(id) {
    try {
        
        let sql = `delete from tbl_status_ocorrencia where id = ${id};`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    insertStatusOcorrencia,
    updateStatusOcorrencia,
    selectAllStatusOcorrencia,
    selectByIdStatusOcorrencia,
    deleteStatusOcorrencia
}
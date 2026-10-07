/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status do setor
 * Data: 2026/10/07
 * Autor: Matheus Lucas
 * Versão: 1.0
 *************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertStatusSetor = async function(dados) {
    try {
        
        let sql = `insert into tbl_status_setor(
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

const updateStatusSetor = async function(dados) {
    try {
        
        let sql = `update tbl_status_setor set
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

const selectAllStatusSetor = async function() {
    try {
        
        let sql = `select * from tbl_status_setor order by id desc;`

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

const selectByIdStatusConta = async function(id) {
    try {
        
        let sql = `select * from tbl_status_setor where id = ${id};`

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

const deleteStatusConta = async function(id) {
    try {
        
        let sql = `delete from tbl_status_setor where id = ${id};`

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
    insertStatusSetor,
    updateStatusSetor,
    selectAllStatusSetor,
    selectByIdStatusConta,
    deleteStatusConta
}
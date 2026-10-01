/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da conta do usuário
 * Data: 2026/10/01
 * Autor: Matheus Lucas
 * Versão: 1.0
 *************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertStatusConta = async function(dados) {
    try {
        
        let sql = `insert into tbl_status_conta(
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

const updateStatusConta = async function(dados) {
    try {
        
        let sql = `update tbl_status_conta set
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

const selectAllStatusConta = async function() {
    try {
        
        let sql = `select * from tbl_status_conta order by id desc;`

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
        
        let sql = `select * from tbl_status_conta where id = ${id};`

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
        
        let sql = `delete from tbl_status_conta where id = ${id};`

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
    insertStatusConta,
    updateStatusConta,
    selectAllStatusConta,
    selectByIdStatusConta,
    deleteStatusConta
}
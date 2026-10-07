/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da conta do usuário
 * Data: 2026/10/01
 * Autor: Nathan Luna 
 * Versão: 1.0
 *
 *************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')
const e = require('cors')

const knexConection = knex(knexDataBaseConfig.development)

const insertStatusFuncionario = async function(dados) {
    try {
        let sql = `insert into tbl_status_funcionario 
                (
                status
                ) values
                    ('${dados.status}')`

        
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

const updateStatusFuncionario = async function(dados){
    try {
        let sql = `update tbl_status_funcionario set
                    status = "${dados.status}"
                    where id = ${dados.id}
                    ;`
        
        let result = knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }
                    
    } catch (error) {
        return false
    }
}

const selectAllStatusFuncionario = async function(){
    try {
        let sql = `select * from tbl_status_funcionario order by id desc`

        let result = knexConection.raw(sql)

        if(result){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

const selectByIdStatosFuncionario = async function(id){
    try {
        
        let sql = `select * from tbl_usuario where id = ${id};`

        let result = knexConection.raw(sql)

        if(result){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

const deleteStatosFuncionario = async function(id){
    try {
        let sql = `delete from tbl_usuario where id = ${id};`

        let result = knexConection.raw(sql)

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
    insertStatusFuncionario,
    updateStatusFuncionario,
    selectAllStatusFuncionario,
    selectByIdStatosFuncionario,
    deleteStatosFuncionario
}
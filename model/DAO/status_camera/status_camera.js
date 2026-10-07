/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da câmera
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

const insertStatusCamera = async function(dados) {
    try {
        
        let sql = `insert into tbl_status_camera(
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

const updateStatusCamera = async function(dados) {
    try {
        
        let sql = `update tbl_status_camera set
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

const selectAllStatusCamera = async function() {
    try {
        
        let sql = `select * from tbl_status_camera order by id desc;`

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

const selectByIdStatusCamera = async function(id) {
    try {
        
        let sql = `select * from tbl_status_camera where id = ${id};`

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

const deleteStatusCamera = async function(id) {
    try {
        
        let sql = `delete from tbl_status_camera where id = ${id};`

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
    insertStatusCamera,
    updateStatusCamera,
    selectAllStatusCamera,
    selectByIdStatusCamera,
    deleteStatusCamera
}
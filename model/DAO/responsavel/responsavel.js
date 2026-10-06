/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do responsavel
 * Data: 2026/10/06
 * Autor: Matheus Lucas
 * Versão: 1.0
 *************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertResponsavel = async function(dados) {
    try {
        
        let sql = `insert into tbl_responsavel(
                        cpf,
                        id_usuario
                    )values(
                        "${dados.cpf}",
                        "${dados.id_usuario}"
                    );`
        
        let result = await knexConection.raw(sql)

        if(result){
            return result[0].insertId
        }else{
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const updateResponsavel = async function(dados) {
    try {
        
        let sql = `update tbl_responsavel set
                        cpf = "${dados.cpf}",
                        id_usuario = "${dados.id_usuario}"
                        where id = ${dados.id};`
        
        let result = await knexConection.raw(sql)
        
        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectAllResponsavel = async function() {
    try {
        
        let sql = `select * from tbl_responsavel order by id desc;`

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

const selectByIdResponsavel = async function(id) {
    try {
        
        let sql = `select * from tbl_responsavel where id = ${id};`

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

const deleteResponsavel = async function(id) {
    try {
        
        let sql = `delete from tbl_responsavel where id = ${id};`

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
    insertResponsavel,
    updateResponsavel,
    selectAllResponsavel,
    selectByIdResponsavel,
    deleteResponsavel
}
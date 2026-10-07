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

const insertSetor = async function(dados) {
    try {
        
        let sql = `insert into tbl_setor(
                        nome,
                        foto, 
                        descricao, 
                        local, 
                        id_status_setor
                    )values(
                        "${dados.nome}",
                        "${dados.foto}",
                        "${dados.descricao}",
                        "${dados.local}",
                        ${dados.id_status_setor}

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

const updateSetor = async function(dados) {
    try {
        
        let sql = `update tbl_setor set
                        nome            = "${dados.nome}",
                        foto            = "${dados.foto}",
                        descricao       = "${dados.descricao}",
                        local           = "${dados.local}",
                        id_status_setor = ${dados.id_status_setor}
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

const selectAllSetor = async function() {
    try {
        
        let sql = `select * from tbl_setor order by id desc;`

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

const selectByIdSetor = async function(id) {
    try {
        
        let sql = `select * from tbl_setor where id = ${id};`

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

const deleteSetor = async function(id) {
    try {
        
        let sql = `delete from tbl_setor where id = ${id};`

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
    insertSetor,
    updateSetor,
    selectAllSetor,
    selectByIdSetor,
    deleteSetor
}
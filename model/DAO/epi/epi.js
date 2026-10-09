/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da EPI
 * Data: 2026/10/09
 * Autor: Matheus Lucas
 * Versão: 1.0
 *************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertEPI = async function(dados) {
    try {
        
        let sql = `insert into tbl_epi(
                        nome,
                        descricao,
                        foto,
                        cor
                    )values(
                        "${dados.nome}",
                        "${dados.descricao}",
                        "${dados.foto}",
                        "${dados.cor}"
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

const updateEPI = async function(dados) {
    try {
        
        let sql = `update tbl_epi set
                        nome                = "${dados.nome}",
                        descricao           = "${dados.descricao}",
                        foto                = "${dados.foto}",
                        cor                 = "${dados.cor}"
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

const selectAllEPI = async function() {
    try {
        
        let sql = `select * from tbl_epi order by id desc;`

        let result = await knexConection.raw(sql)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectByIdEPI = async function(id) {
    try {
        
        let sql = `select * from tbl_epi where id = ${id};`

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

const deleteEPI = async function(id) {
    try {
        
        let sql = `delete from tbl_epi where id = ${id};`

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
    insertEPI,
    updateEPI,
    selectAllEPI,
    selectByIdEPI,
    deleteEPI
}
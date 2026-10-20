/***************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da tabela intermediaria de setor e EPI
 * Data: 2026/10/20
 * Autor: Estephano Borovicz
 * Versão: 1.0
 ***************************************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertSetorEpi = async function(dados) {

    try {
        
        let sql = `insert into tbl_setor_epi(
                        id_epi,
                        id_setor
                    )values(
                        ${dados.id_epi},
                        ${dados.id_setor}
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

const updateSetorEpi = async function(dados) {
    try {
        
        let sql = `update tbl_setor_epi set
                        id_epi        = ${dados.id_epi},
                        id_setor  = ${dados.id_setor}
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

const selectAllSetorEpi = async function() {
    try {
        
        let sql = `select * from tbl_setor_epi order by id desc;`

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

const selectByIdSetorEpi = async function(id) {
    try {
        
        let sql = `select * from tbl_setor_epi where id = ${id};`

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
const selectByEpiIdSetor = async function(id_setor) {
    try {
        
        let sql = ``

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

const selectBySetorIdEpi = async function(id_epi) {
    try {
        
        let sql = ``

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


const deleteSetorEpi = async function(id) {
    try {
        
        let sql = `delete from tbl_setor_epi where id = ${id};`

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
    insertSetorEpi,
    updateSetorEpi, 
    selectAllSetorEpi,
    selectByIdSetorEpi,
    selectByEpiIdSetor,
    selectBySetorIdEpi,
    deleteSetorEpi
}
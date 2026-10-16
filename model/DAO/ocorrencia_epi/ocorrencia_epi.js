/***************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da tabela intermediaria de ocorrencia e EPI
 * Data: 2026/10/16
 * Autor: Matheus Lucas
 * Versão: 1.0
 ***************************************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertOcorrenciaEpi = async function(dados) {
    try {
        
        let sql = `insert into tbl_ocorrencia_epi(
                        id_epi,
                        id_ocorrencia
                    )values(
                        ${dados.id_epi},
                        ${dados.id_ocorrencia}
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

const updateOcorrenciaEpi = async function(dados) {
    try {
        
        let sql = `update tbl_ocorrencia_epi set
                        id_epi        = ${dados.id_epi},
                        id_ocorrencia  = ${dados.id_ocorrencia}
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

const selectAllOcorrenciaEpi = async function() {
    try {
        
        let sql = `select * from tbl_ocorrencia_epi order by id desc;`

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

const selectByIdOcorrenciaEpi = async function(id) {
    try {
        
        let sql = `select * from tbl_ocorrencia_epi where id = ${id};`

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
const selectBySetorIdOcorrencia = async function(id_ocorrencia) {
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

const selectByOcorrenciaIdEPI = async function(id_epi) {
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


const deleteOcorrenciaEpi = async function(id) {
    try {
        
        let sql = `delete from tbl_ocorrencia_epi where id = ${id};`

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
    insertOcorrenciaEpi,
    updateOcorrenciaEpi, 
    selectAllOcorrenciaEpi,
    selectByIdOcorrenciaEpi,
    selectByOcorrenciaIdEPI,
    selectBySetorIdOcorrencia,
    deleteOcorrenciaEpi
}
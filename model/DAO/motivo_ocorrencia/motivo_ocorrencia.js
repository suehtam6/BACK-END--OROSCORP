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

const insertMotivoOcorrencia = async function(dados) {
    try {
        
        let sql = `insert into tbl_motivo_ocorrencia (
                        nome
                    ) values (
                     '${dados.nome}'
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

const updateMotivoOcorrencia = async function(dados) {
    try {
        
        let sql = `update tbl_motivo_ocorrencia set
                        nome = "${dados.nome}"
                        where id = ${dados.id}
                        ;`
        
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

const selectAllMotivoOcorrencia = async function() {
    try {
        
        let sql = `select * from tbl_motivo_ocorrencia order by id desc;`

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

const selectByIdMotivoOcorrencia = async function(id) {
    try {
        
        let sql = `select * from tbl_motivo_ocorrencia where id = ${id};`

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

const deleteMotivoOcorrencia = async function(id) {
    try {
        
        let sql = `delete from tbl_motivo_ocorrencia where id = ${id};`

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
    insertMotivoOcorrencia,
    updateMotivoOcorrencia,
    selectAllMotivoOcorrencia,
    selectByIdMotivoOcorrencia,
    deleteMotivoOcorrencia
}
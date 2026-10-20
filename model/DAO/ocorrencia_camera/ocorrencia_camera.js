/***************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da tabela intermediaria de ocorrencia e EPI
 * Data: 2026/10/16
 * Autor: Matheus Lucas
 * Versão: 1.0
 ***************************************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertOcorrenciaCamera = async function(dados) {
    try {
        
        let sql = `insert into tbl_ocorrencia_camera(
                        id_camera,
                        id_ocorrencia,
                        foto,
                        data_hora,
                        confianca_ia
                    )values(
                        ${dados.id_camera},
                        ${dados.id_ocorrencia},
                        '${dados.foto}',
                        '${dados.data_hora}',
                        '${dados.confianca_ia}'
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

const updateOcorrenciaCamera = async function(dados) {
    try {
        
        let sql = `update tbl_ocorrencia_camera set
                        id_camera           = ${dados.id_camera},
                        id_ocorrencia       = ${dados.id_ocorrencia},
                        foto                = '${dados.foto}',
                        confianca_ia        = '${dados.confianca_ia}',
                        data_hora           = '${dados.data_hora}'

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

const selectAllOcorrenciaCamera = async function() {
    try {
        
        let sql = `select * from tbl_ocorrencia_camera order by id desc;`

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

const selectByIdOcorrenciaCamera = async function(id) {
    try {
        
        let sql = `select * from tbl_ocorrencia_camera where id = ${id};`

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
const selectByCameraIdOcorrencia = async function(id_ocorrencia) {
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

const selectByOcorrenciaIdCamera = async function(id_epi) {
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


const deleteOcorrenciaCamera = async function(id) {
    try {
        
        let sql = `delete from tbl_ocorrencia_camera where id = ${id};`

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
    insertOcorrenciaCamera,
    updateOcorrenciaCamera, 
    selectAllOcorrenciaCamera,
    selectByIdOcorrenciaCamera,
    selectByOcorrenciaIdCamera,
    selectByCameraIdOcorrencia,
    deleteOcorrenciaCamera
}
/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da conta do usuário
 * Data: 2026/10/16
 * Autor: Nathan Luna 
 * Versão: 1.0
 *
 *************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')
const e = require('cors')

const knexConection = knex(knexDataBaseConfig.development)

const insertOcorrencia = async function(dados) {
    try {
        
        let sql = `insert into tbl_ocorrencia(
            descricao, 
            id_ocorrencia,
            id_funcionario,
            id_motivo_ocorrencia,
            id_status_ocorrencia,
            id_usuario_registro
        ) values(  
            '${dados.descricao}',
             ${dados.id_ocorrencia}, 
             ${dados.id_funcionario}, 
             ${dados.id_motivo_ocorrencia}, 
             ${dados.id_status_ocorrencia}, 
             ${dados.id_usuario_registro}
            );
`
        
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

const selectAllOcorrencia = async function() {
    try {
        
        let sql = `select * from tbl_ocorrencia order by id desc;`

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

const selectDadosByIdOcorrencia = async function(id) {

    try {
        
        let sql = `CALL sp_buscar_ocorrencia(${id});`


            let result = await knexConection.raw(sql)

            if(Array.isArray(result)){
                return result[0][0]
            }else{

                return false
            }
            

    } catch (error) {
        return false
    }
    
}



const updateOcorrencia = async function(dados) {
    try {
        
        let sql = `update tbl_ocorrencia set
                        descricao = "${dados.descricao}",
                        id_ocorrencia = ${dados.id_ocorrencia},
                        id_funcionario = ${dados.id_funcionario},
                        id_motivo_ocorrencia = ${dados.id_motivo_ocorrencia},
                        id_status_ocorrencia = ${dados.id_status_ocorrencia},
                        id_usuario_registro = ${dados.id_usuario_registro}
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

const selectByIdOcorrencia = async function(id) {
    try {
        
        let sql = `select * from tbl_ocorrencia where id = ${id};`

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

const deleteOcorrencia = async function(id) {
    try {
        
        let sql = `delete from tbl_ocorrencia where id = ${id};`

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
    insertOcorrencia,
    selectAllOcorrencia,
    updateOcorrencia,
    selectByIdOcorrencia,
    selectDadosByIdOcorrencia,
    deleteOcorrencia
}
/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do adm
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

const insertADM = async function(dados) {
    try {
        
        let sql = `insert into tbl_adm(
                        cnpj,
                        razao_social,
                        id_usuario
                    )values(
                        "${dados.cnpj}",
                        "${dados.razao_social}",
                        "${dados.id_usuario}"
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

const updateADM = async function(dados) {
    try {
        
        let sql = `update tbl_adm set
                        cnpj = "${dados.cnpj}",
                        razao_social = "${dados.razao_social}",
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

const selectAllADM = async function() {
    try {
        
        let sql = `select * from tbl_adm order by id desc;`

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

const selectByIdADM = async function(id) {
    try {
        
        let sql = `select * from tbl_adm where id = ${id};`

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

const deleteADM = async function(id) {
    try {
        
        let sql = `delete from tbl_adm where id = ${id};`

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
    insertADM,
    updateADM,
    selectAllADM,
    selectByIdADM,
    deleteADM
}
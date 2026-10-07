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

const insertCamera = async function(dados) {
    try {
        
        let sql = `insert into tbl_camera(
                        nome,
                        descricao,
                        endereco_stream,
                        id_setor,
                        id_status_camera
                    )values(
                        "${dados.nome}",
                        "${dados.descricao}",
                        "${dados.endereco_stream}",
                        ${dados.id_setor},
                        ${dados.id_status_camera}
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

const updateCamera = async function(dados) {
    try {
        
        let sql = `update tbl_camera set
                        nome                = "${dados.nome}"
                        descricao           = "${dados.descricao}"
                        endereco_stream     = "${dados.endereco_stream}"
                        id_setor            =  ${dados.id_setor}
                        id_status_camera    =  ${dados.id_status_camera}
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

const selectAllCamera = async function() {
    try {
        
        let sql = `select * from tbl_camera order by id desc;`

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

const selectByIdCamera = async function(id) {
    try {
        
        let sql = `select * from tbl_camera where id = ${id};`

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

const deleteCamera = async function(id) {
    try {
        
        let sql = `delete from tbl_camera where id = ${id};`

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
    insertCamera,
    updateCamera,
    selectAllCamera,
    selectByIdCamera,
    deleteCamera
}
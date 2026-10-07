/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da conta do usuário
 * Data: 2026/10/07
 * Autor: Nathan Luna 
 * Versão: 1.0
 *
 *************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')
const e = require('cors')

const knexConection = knex(knexDataBaseConfig.development)

const insertFuncionario = async function(dados) {
    try {
        
        let sql = `insert into tbl_funcionario(
                        nome,
                        data_nascimento, 
                        cpf, 
                        email, 
                        foto, 
                        id_cargo, 
                        id_setor,
                        id_status_funcionario
                    )values(
                        "${dados.nome}",
                        "${dados.data_nascimento}",
                        "${dados.cpf}",
                        "${dados.email}",
                        "${dados.foto}",
                        ${dados.id_cargo},
                        ${dados.id_setor},
                        ${dados.id_status_funcionario}

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

const updateFuncionario = async function(dados) {
    try {
        
        let sql = `update tbl_funcionario set
                        nome                  = "${dados.nome}",
                        data_nascimento       = "${dados.data_nascimento}",
                        cpf                   = "${dados.cpf}",
                        email                 = "${dados.email}",
                        foto                  = "${dados.foto}",
                        id_cargo              = ${dados.id_cargo},
                        id_setor              = ${dados.id_setor},
                        id_status_funcionario = ${dados.id_status_funcionario},
                        where id              = ${dados.id};`
        
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

const selectAllFuncionario = async function() {
    try {
        
        let sql = `select * from tbl_funcionario order by id desc;`

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

const selectByIdFuncionario = async function(id) {
    try {
        
        let sql = `select * from tbl_funcionario where id = ${id};`

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

const deleteFuncionario = async function(id) {
    try {
        
        let sql = `delete from tbl_funcionario where id = ${id};`

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
    insertFuncionario,
    updateFuncionario,
    selectAllFuncionario,
    selectByIdFuncionario,
    deleteFuncionario
}
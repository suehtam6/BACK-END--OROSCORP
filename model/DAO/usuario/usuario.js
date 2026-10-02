/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da conta do usuário
 * Data: 2026/10/01
 * Autor: Matheus Lucas
 * Versão: 1.0
 *
 * Caminho sugerido: model/DAO/usuario/usuario.js
 *************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertUsuario = async function(dados) {
    try {
        
        let sql = `insert into tbl_usuario(
                        nome,
                        foto, 
                        email, 
                        senha, 
                        data_nascimento, 
                        id_nivel_acesso, 
                        id_status_conta
                    )values(
                        "${dados.nome}",
                        "${dados.foto}",
                        "${dados.email}",
                        "${dados.senha}",
                        "${dados.data_nascimento}",
                        ${dados.id_nivel_acesso},
                        ${dados.id_status_conta}

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

const updateUsuario = async function(dados) {
    try {
        
        let sql = `update tbl_usuario set
                        nome            = "${dados.nome}",
                        foto            = "${dados.foto}",
                        email           = "${dados.email}",
                        senha           = "${dados.senha}",
                        data_nascimento = "${dados.data_nascimento}",
                        id_nivel_acesso = ${dados.id_nivel_acesso},
                        id_status_conta = ${dados.id_status_conta}
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

const selectAllUsuario = async function() {
    try {
        
        let sql = `select * from tbl_usuario order by id desc;`

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

const selectByIdUsuario = async function(id) {
    try {
        
        let sql = `select * from tbl_usuario where id = ${id};`

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

const deleteUsuario = async function(id) {
    try {
        
        let sql = `delete from tbl_usuario where id = ${id};`

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

// Verifica se ja existe pelo menos um usuario cadastrado no sistema.
// Usada pelo middleware que libera o cadastro do primeiro ADM sem token
// (autorizacaoCadastroInicial.js).
const existeUsuario = async function () {
    try {
        let sql = `select count(*) as total from tbl_usuario;`
        let result = await knexConection.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0) {
            return result[0][0].total > 0
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

module.exports = {
    insertUsuario,
    updateUsuario,
    selectAllUsuario,
    selectByIdUsuario,
    deleteUsuario,
    existeUsuario
}
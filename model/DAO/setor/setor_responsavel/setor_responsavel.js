/***************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do status da tabela intermediaria de Setor e Responsavel
 * Data: 2026/10/09
 * Autor: Matheus Lucas
 * Versão: 1.0
 ***************************************************************************************************************/

// Import da biblioteca Knex para manipular dados no Banco de dados MySQL.
const knex = require('knex')

// Import do arquivo para configuração para acesso ao banco de dados.
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o banco de dados mySQL conforme o arquivo de configuração.
const knexConection = knex(knexDataBaseConfig.development)

const insertSetorResponsavel = async function(dados) {
    try {
        
        let sql = `insert into tbl_setor_responsavel(
                        id_setor,
                        id_responsavel
                    )values(
                        ${dados.id_setor},
                        ${dados.id_responsavel}
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

const updateSetorResponsavel = async function(dados) {
    try {
        
        let sql = `update tbl_setor_responsavel set
                        id_setor        = ${dados.id_setor}
                        id_responsavel  = ${dados.id_responsavel}
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

const selectAllSetorResponsavel = async function() {
    try {
        
        let sql = `select * from tbl_setor_responsavel order by id desc;`

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

const selectByIdSetorResponsavel = async function(id) {
    try {
        
        let sql = `select * from tbl_setor_responsavel where id = ${id};`

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
const selectBySetorIdResponsavel = async function(id_responsavel) {
    try {
        
        let sql = `select tbl_setor.id, tbl_setor.nome as nome_setor, tbl_setor.descricao as descricao_setor, tbl_setor.foto as foto_setor,
                        tbl_setor.local as local_setor,
                        tbl_status_setor.status as status_setor,
                        tbl_responsavel.id, tbl_responsavel.cpf,
                        tbl_usuario.nome as nome_usuario, tbl_usuario.email as email_usuario, tbl_usuario.foto as foto_usuario,
                        tbl_usuario.data_nascimento, tbl_usuario.id_nivel_acesso, tbl_usuario.id_status_conta,
                        tbl_nivel_acesso.nome as nivel_acesso, tbl_status_conta.status as status_conta
                    from tbl_setor
                    inner join tbl_status_setor 
                        on tbl_status_setor.id = tbl_setor.id_status_setor
                    inner join tbl_setor_responsavel 
                        on tbl_setor_responsavel.id_setor = tbl_setor.id
                    inner join tbl_responsavel 	
                        on tbl_responsavel.id = tbl_setor_responsavel.id_responsavel
                    inner join tbl_usuario
                        on tbl_usuario.id = tbl_responsavel.id_usuario
                    inner join tbl_nivel_acesso
                        on tbl_nivel_acesso.id = tbl_usuario.id_nivel_acesso
                    inner join tbl_status_conta 
                        on tbl_status_conta.id = tbl_usuario.id_status_conta
                    where tbl_setor_responsavel.id_responsavel = ${id};`

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

const selectByResponsavelIdSetor = async function(id_setor) {
    try {
        
        let sql = `select tbl_setor.id, tbl_setor.nome as nome_setor, tbl_setor.descricao as descricao_setor, tbl_setor.foto as foto_setor,
                        tbl_setor.local as local_setor,
                        tbl_status_setor.status as status_setor,
                        tbl_responsavel.id, tbl_responsavel.cpf,
                        tbl_usuario.nome as nome_usuario, tbl_usuario.email as email_usuario, tbl_usuario.foto as foto_usuario,
                        tbl_usuario.data_nascimento, tbl_usuario.id_nivel_acesso, tbl_usuario.id_status_conta,
                        tbl_nivel_acesso.nome as nivel_acesso, tbl_status_conta.status as status_conta
                    from tbl_setor
                    inner join tbl_status_setor 
                        on tbl_status_setor.id = tbl_setor.id_status_setor
                    inner join tbl_setor_responsavel 
                        on tbl_setor_responsavel.id_setor = tbl_setor.id
                    inner join tbl_responsavel 	
                        on tbl_responsavel.id = tbl_setor_responsavel.id_responsavel
                    inner join tbl_usuario
                        on tbl_usuario.id = tbl_responsavel.id_usuario
                    inner join tbl_nivel_acesso
                        on tbl_nivel_acesso.id = tbl_usuario.id_nivel_acesso
                    inner join tbl_status_conta 
                        on tbl_status_conta.id = tbl_usuario.id_status_conta
                    where tbl_setor_responsavel.id_setor = ${id};`

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


const deleteSetorResponsavel = async function(id) {
    try {
        
        let sql = `delete from tbl_setor_responsavel where id = ${id};`

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
    insertSetorResponsavel,
    updateSetorResponsavel,
    selectAllSetorResponsavel,
    selectByIdSetorResponsavel,
    selectByResponsavelIdSetor,
    selectBySetorIdResponsavel,
    deleteSetorResponsavel
}
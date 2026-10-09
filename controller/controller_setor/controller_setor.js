/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do status do setor
 * Data: 2026/10/07
 * Autor: Matheus Lucas
 * Versão: 1.0
 **************************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const setorDAO = require('../../model/DAO/setor/setor.js')


// Import das controller para utilizar no Setor
const controllerStatusSetor = require("../controller_status_setor/controller_status_setor.js")

// Import da biblioteca para gerar o hash da senha antes de salvar no banco
const bcrypt = require('bcryptjs')



const inserirSetor = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await setorDAO.insertSetor(await tratarDados(dados))

                if (result) {
                    dados.id = result

                    customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_CREATE_ITEM.status
                    customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_CREATE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE_MATHEUS.message = customMessage.SUCCESS_CREATE_ITEM.message
                    customMessage.DEFAULT_MESSAGE_MATHEUS.response = dados
                    return customMessage.DEFAULT_MESSAGE_MATHEUS // RETORNA UM 201

                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
                }

            } else {
                return validar // RETORNA UM 400
            }



        } else {
            return customMessage.ERROR_CONTENT_TYPE // RETORNA UM 415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (Controller)
    }

}


const atualizarSetor = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarSetor = await buscarSetor(id)

            if(resultBuscarSetor.status){

                if(resultBuscarSetor){


                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await setorDAO.updateSetor(dados)

                        if(result){

                            customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_UPDATED_ITEM.status
                            customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                            customMessage.DEFAULT_MESSAGE_MATHEUS.message = customMessage.SUCCESS_UPDATED_ITEM.message
                            customMessage.DEFAULT_MESSAGE_MATHEUS.response = dados
                            return customMessage.DEFAULT_MESSAGE_MATHEUS //RETORNA 200


                        }else{
                            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA 500 (MODEL)
                        }

                    }else{
                        return validar // RETORNA UM 400
                    }


                }else{
                    return customMessage.ERROR_BAD_REQUEST // RETORNA 400
                }


            }else{
                return resultBuscarSetor // RETORNA UM 400
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const listarSetor = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await setorDAO.selectAllSetor()

        if (result) {

            if (result.length > 0) {

                for (dados of result) {
                   
                    let resultStatusSetor = await controllerStatusSetor.buscarStatusSetor(dados.id_status_setor)

                    if (resultStatusSetor.status) {
                        dados.status_setor = resultStatusSetor.response.dados

                        delete dados.id_status_setor
                    } else {
                        return resultStatusSetor
                    }



                }


                customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_RESPONSE.status_code // RETORNA UM 200
                customMessage.DEFAULT_MESSAGE_MATHEUS.response.count = result.length
                customMessage.DEFAULT_MESSAGE_MATHEUS.response.dados = result

                return customMessage.DEFAULT_MESSAGE_MATHEUS // RETORNA UM 200

            } else {
                return customMessage.ERROR_NOT_FOUND  // RETORNA UM 400
            }

        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }

}

const buscarSetor = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID SETOR] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await setorDAO.selectByIdSetor(id)

            if (result) {

                if (result.length > 0) {


                
                for (dados of result) {
                   
                    

                    let resultStatusSetor = await controllerStatusSetor.buscarStatusSetor(dados.id_status_setor)

                    if (resultStatusSetor.status) {
                        dados.status_setor = resultStatusSetor.response.dados

                        delete dados.id_status_setor
                    } else {
                        return resultStatusSetor
                    }



                }


                    customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_MATHEUS.response.dados = result

                    return customMessage.DEFAULT_MESSAGE_MATHEUS // RETORNA UM 200



                } else {
                    return customMessage.ERROR_NOT_FOUND // RETORNA UM 404
                }


            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const excluirSetor = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await setorDAO.deleteSetor(id)
        if (result) {

            customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE_MATHEUS.message = customMessage.SUCCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE_MATHEUS // RETORNA UM 200


        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }

}

const validarDados = async function (dados) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (dados.nome == undefined || dados.nome == '' || dados.nome == null || dados.nome.length > 100) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if ((dados.foto == undefined || dados.foto == '' || dados.foto == null || dados.foto.length > 256)) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if ((dados.descricao == undefined || dados.descricao == '' || dados.descricao == null || dados.descricao.length > 500)) {
        customMessage.ERROR_BAD_REQUEST.field = '[DESCRIÇÃO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if ((dados.local == undefined || dados.local == '' || dados.local == null || dados.local.length > 80)) {
        customMessage.ERROR_BAD_REQUEST.field = '[LOCAL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } 

    return false
}

const tratarDados = async function (dados) {
    dados.nome = dados.nome.replaceAll("'", "")
    dados.foto = dados.foto.replaceAll("'", "")
    dados.descricao = dados.descricao.replaceAll("'", "")
    dados.local = dados.local.replaceAll("'", "")


    return dados
}

module.exports = {
    inserirSetor,
    atualizarSetor,
    listarSetor,
    buscarSetor,
    excluirSetor
}
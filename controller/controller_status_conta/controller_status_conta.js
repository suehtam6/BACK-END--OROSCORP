/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do nivel de acesso
 * Data: 2026/10/01
 * Autor: Matheus Lucas
 * Versão: 1.0
 ******************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const StatusContaDAO = require('../../model/DAO/status_conta/status_conta.js')


const inserirStatusConta = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await StatusContaDAO.insertStatusConta(await tratarDados(dados))

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


const atualizarStatusConta = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarStatusConta = await buscarStatusConta(id)

            if(resultBuscarStatusConta.status){

                if(resultBuscarStatusConta){


                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await StatusContaDAO.updateStatusConta(dados)

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
                return resultBuscarStatusConta // RETORNA UM 400
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const listarStatusConta = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await StatusContaDAO.selectAllStatusConta()

        if (result) {

            if (result.length > 0) {

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

const buscarStatusConta = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await StatusContaDAO.selectByIdStatusConta(id)

            if (result) {

                if (result.length > 0) {

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

const excluirStatusConta = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await StatusContaDAO.deleteStatusConta(id)
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
    if (dados.status == undefined || dados.status == '' || dados.status == null || dados.status.length > 20) {
        customMessage.ERROR_BAD_REQUEST.field = '[STATUS CONTA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = async function (dados) {
    dados.status == dados.status.replaceAll("'", "")

    return dados
}

module.exports = {
    inserirStatusConta,
    atualizarStatusConta,
    listarStatusConta,
    buscarStatusConta,
    excluirStatusConta
}
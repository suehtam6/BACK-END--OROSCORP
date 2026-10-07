/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do cargo
 * Data: 2026/10/06
 * Autor: Matheus Lucas
 * Versão: 1.0
 ******************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const cargoDAO = require('../../model/DAO/cargo/cargo.js')




const inserirCargo = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await cargoDAO.insertCargo(await tratarDados(dados))

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
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (Controller)
    }

}


const atualizarCargo = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarCargo = await buscarCargo(id)

            if(resultBuscarCargo.status){

                if(resultBuscarCargo){


                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await cargoDAO.updateCargo(dados)

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
                return resultBuscarUsuario // RETORNA UM 400
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const listarCargo = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await cargoDAO.selectAllCargo()

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

const buscarCargo = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await cargoDAO.selectByIdCargo(id)

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

const excluirCargo = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await cargoDAO.deleteCargo(id)
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

    if (dados.cargo == undefined || dados.cargo == '' || dados.cargo == null || dados.cargo > 30) {
        customMessage.ERROR_BAD_REQUEST.field = '[CARGO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    return false
}

const tratarDados = async function (dados) {
    dados.cargo = dados.cargo.replaceAll("'", "")

    return dados
}

module.exports = {
    inserirCargo,
    atualizarCargo,
    listarCargo,
    buscarCargo,
    excluirCargo
}
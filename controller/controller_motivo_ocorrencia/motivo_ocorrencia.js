/***********************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do status câmera
 * Data: 2026/10/01
 * Autor: Nathan Luna
 * Versão: 1.0
 ************************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const motivo_ocorrenciaDAO = require('../../model/DAO/motivo_ocorrencia/motivo_ocorrencia.js')


const inserirmotivo_ocorrencia = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await motivo_ocorrenciaDAO.insertMotivoOcorrencia(await tratarDados(dados))
                console.log(result)
                if (result) {
                    dados.id = result

                    customMessage.DEFAULT_MESSAGE_NATHAN.status = customMessage.SUCCESS_CREATE_ITEM.status
                    customMessage.DEFAULT_MESSAGE_NATHAN.status_code = customMessage.SUCCESS_CREATE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE_NATHAN.message = customMessage.SUCCESS_CREATE_ITEM.message
                    customMessage.DEFAULT_MESSAGE_NATHAN.response = dados
                    return customMessage.DEFAULT_MESSAGE_NATHAN // RETORNA UM 201

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


const atualizarmotivo_ocorrencia = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarmotivo_ocorrencia = await buscarmotivo_ocorrencia(id)

            if(resultBuscarmotivo_ocorrencia.status){

                if(resultBuscarmotivo_ocorrencia){

                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await motivo_ocorrenciaDAO.updateMotivoOcorrencia(dados)

                        if(result){

                            customMessage.DEFAULT_MESSAGE_NATHAN.status = customMessage.SUCCESS_UPDATED_ITEM.status
                            customMessage.DEFAULT_MESSAGE_NATHAN.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                            customMessage.DEFAULT_MESSAGE_NATHAN.message = customMessage.SUCCESS_UPDATED_ITEM.message
                            customMessage.DEFAULT_MESSAGE_NATHAN.response = dados
                            return customMessage.DEFAULT_MESSAGE_NATHAN //RETORNA 200


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
                return resultBuscarmotivo_ocorrencia // RETORNA UM 400
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const listarmotivo_ocorrencia = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await motivo_ocorrenciaDAO.selectAllMotivoOcorrencia()

        if (result) {

            if (result.length > 0) {

                customMessage.DEFAULT_MESSAGE_NATHAN.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE_NATHAN.status_code = customMessage.SUCCESS_RESPONSE.status_code // RETORNA UM 200
                customMessage.DEFAULT_MESSAGE_NATHAN.response.count = result.length
                customMessage.DEFAULT_MESSAGE_NATHAN.response.dados = result

                return customMessage.DEFAULT_MESSAGE_NATHAN // RETORNA UM 200

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

const buscarmotivo_ocorrencia = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID STATUS CÂMERA] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await motivo_ocorrenciaDAO.selectByIdMotivoOcorrencia(id)

            if (result) {

                if (result.length > 0) {

                    customMessage.DEFAULT_MESSAGE_NATHAN.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_NATHAN.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_NATHAN.response.dados = result

                    return customMessage.DEFAULT_MESSAGE_NATHAN // RETORNA UM 200



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

const excluirmotivo_ocorrencia = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await motivo_ocorrenciaDAO.deleteMotivoOcorrencia(id)
        if (result) {

            customMessage.DEFAULT_MESSAGE_NATHAN.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE_NATHAN.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE_NATHAN.message = customMessage.SUCCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE_NATHAN // RETORNA UM 200


        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }

}

const validarDados = async function (dados) {
    if (dados.nome == undefined || dados.nome == '' || dados.nome == null || dados.nome.length > 20) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME MOTIVO_OCORRENCIA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = async function (dados) {
    dados.nome == dados.nome.replaceAll("'", "")

    return dados
}

module.exports = {
    inserirmotivo_ocorrencia,
    atualizarmotivo_ocorrencia,
    listarmotivo_ocorrencia,
    buscarmotivo_ocorrencia,
    excluirmotivo_ocorrencia
}
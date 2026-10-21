/**************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o 
 *          CRUD da tabela intermediaria de ocorrencia e EPI.
 * Data: 2026/10/16
 * Autor: Matheus Lucas
 * Versão: 1.0
 *************************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const ocorrenciaEPIDAO = require('../../model/DAO/ocorrencia_epi/ocorrencia_epi.js')

// Import das controllers
const controller_ocorrencia = require('../comtroller_ocorrencia/controller_ocorrencia.js')
const controller_epi = require('../controller_epi/controller_epi.js')


const inserirOcorrenciaEPI = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await ocorrenciaEPIDAO.insertOcorrenciaEpi(dados)

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


const atualizarOcorrenciaEPI = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarOcorrenciaEPI = await buscarOcorrenciaEPI(id)

            if(resultBuscarOcorrenciaEPI.status){

                if(resultBuscarOcorrenciaEPI){


                    let validar = await validarDados(dados)

                    if(!validar){

                        dados.id = Number(id)

                        let result = await ocorrenciaEPIDAO.updateOcorrenciaEpi(dados)

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
                return resultBuscarOcorrenciaEPI // RETORNA UM 400
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const listarOcorrenciaEPI = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await ocorrenciaEPIDAO.selectAllOcorrenciaEpi()

        if (result) {

            if (result.length > 0) {


                for(let dados of result){

                    let resultOcorrencia = await controller_ocorrencia.buscarOcorrencia(dados.id_ocorrencia)

                    if(resultOcorrencia.status){
                        dados.ocorrencia = resultOcorrencia.response.dados

                        delete dados.id_ocorrencia
                    }else{
                        return resultOcorrencia
                    }



                    let resultEPI = await controller_epi.buscarEPI(dados.id_epi)

                    if(resultEPI.status){
                        dados.epi = resultEPI.response.dados

                        delete dados.id_epi
                    }else{
                        return resultEPI
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

const buscarOcorrenciaEPI = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await ocorrenciaEPIDAO.selectByIdOcorrenciaEpi(id)

            if (result) {

                if (result.length > 0) {

                    for(let dados of result){
                        let resultOcorrencia = await controller_ocorrencia.buscarOcorrencia(dados.id_ocorrencia)
                        
    
                        if(resultOcorrencia.status){
                            dados.ocorrencia = resultOcorrencia.response.dados
    
                            delete dados.id_ocorrencia
                        }else{
                            return resultOcorrencia
                        }
    
    
    
                        let resultEPI = await controller_epi.buscarEPI(dados.id_epi)
    
                        if(resultEPI.status){
                            dados.epi = resultEPI.response.dados
    
                            delete dados.id_epi
                        }else{
                            return resultEPI
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

const excluirOcorrenciaEPI = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await ocorrenciaEPIDAO.deleteOcorrenciaEpi(id)
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

const validarDados = async function (SetorResponsavel) {
    if (SetorResponsavel.id_epi == undefined || String(SetorResponsavel.id_epi).replaceAll(' ', '') == '' || SetorResponsavel.id_epi == null || isNaN(SetorResponsavel.id_epi) || SetorResponsavel.id_epi <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID EPI] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (SetorResponsavel.id_ocorrencia == undefined || String(SetorResponsavel.id_ocorrencia).replaceAll(' ', '') == '' || SetorResponsavel.id_ocorrencia == null || isNaN(SetorResponsavel.id_ocorrencia) || SetorResponsavel.id_ocorrencia <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID OCORRENCIA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }

}



module.exports = {
    inserirOcorrenciaEPI,
    atualizarOcorrenciaEPI,
    listarOcorrenciaEPI,
    buscarOcorrenciaEPI,
    excluirOcorrenciaEPI
}
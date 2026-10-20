/**************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o 
 *          CRUD da tabela intermediaria de ocorrencia e Câmera.
 * Data: 2026/10/20
 * Autor: Matheus Lucas
 * Versão: 1.0
 *************************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const ocorrenciaCameraDAO = require('../../model/DAO/ocorrencia_camera/ocorrencia_camera.js')

// Import das controllers
const controller_ocorrencia = require('../comtroller_ocorrencia/controller_ocorrencia.js')
const controller_camera = require('../controller_camera/controller_camera.js')


const inserirOcorrenciaCamera = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await ocorrenciaCameraDAO.insertOcorrenciaCamera(dados)

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


const atualizarOcorrenciaCamera = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarOcorrenciaCamera = await buscarOcorrenciaCamera(id)

            if(resultBuscarOcorrenciaCamera.status){

                if(resultBuscarOcorrenciaCamera){


                    let validar = await validarDados(dados)

                    if(!validar){

                        dados.id = Number(id)

                        let result = await ocorrenciaCameraDAO.updateOcorrenciaCamera(dados)

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

const listarOcorrenciaCamera = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await ocorrenciaCameraDAO.selectAllOcorrenciaCamera()

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



                    let resultCamera = await controller_camera.buscarCamera(dados.id_camera)
                        console.log(resultCamera)
                    if(resultCamera.status){
                        dados.camera = resultCamera.response.dados

                        delete dados.id_camera
                    }else if(!resultCamera.status){
                        dados.camera = null
                    }else{
                        return resultCamera
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

const buscarOcorrenciaCamera = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await ocorrenciaCameraDAO.selectByIdOcorrenciaCamera(id)

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
    
    
    
                        let resultCamera = await controller_camera.buscarCamera(dados.id_camera)
                            
                        if(resultCamera.status){
                            dados.camera = resultCamera.response.dados
    
                            delete dados.id_camera
                        }else if(!resultCamera.status){
                            dados.camera = null
                        }else{
                            return resultCamera
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
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const excluirOcorrenciaCamera = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await ocorrenciaCameraDAO.deleteOcorrenciaCamera(id)
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


    if (dados.id_camera == undefined || String(dados.id_camera).replaceAll(' ', '') == '' || isNaN(dados.id_camera) || dados.id_camera <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID CÂMERA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (dados.id_ocorrencia == undefined || String(dados.id_ocorrencia).replaceAll(' ', '') == '' || dados.id_ocorrencia == null || isNaN(dados.id_ocorrencia) || dados.id_ocorrencia <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID OCORRENCIA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(dados.foto == undefined || dados.foto == null || String(dados.foto).replaceAll(' ', '') == '' || !isNaN(dados.foto) || dados.foto.length > 256){
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    }else if(dados.data_hora == undefined || dados.data_hora == null || String(dados.data_hora).replaceAll(' ', '') == '' || !isNaN(dados.data_hora) || dados.data_hora.length > 20){
        customMessage.ERROR_BAD_REQUEST.field = '[DATA E HORA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if(dados.confianca_ia == undefined || String(dados.confianca_ia).replaceAll(' ', '') == '' || isNaN(dados.confianca_ia) || dados.confianca_ia.length > 5){
        customMessage.ERROR_BAD_REQUEST.field = '[CONFIANÇA DA IA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else{
        return false
    }

}



module.exports = {
    inserirOcorrenciaCamera,
    atualizarOcorrenciaCamera,
    listarOcorrenciaCamera,
    buscarOcorrenciaCamera,
    excluirOcorrenciaCamera
}
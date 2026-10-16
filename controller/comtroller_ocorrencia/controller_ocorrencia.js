/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do nivel de acesso
 * Data: 2026/10/16
 * Autor: Nathan Luna
 * Versão: 1.0
 ******************************************************************************************************************/

const configMessages = require("../../controller/modulo/configMessages")

const ocorrenciaDAO = require("../../model/DAO/ocorrencia/ocorrencia.js")
const controller_setor = require("../controller_setor/controller_setor.js")
const controllerFuncionario = require("../controller_funcionario/controller_funcionario.js")
const controllerMotivo_ocorrencia = require ("../controller_motivo_ocorrencia/motivo_ocorrencia.js")
const controller_status_ocorrencia = require("../controller_status_ocorrencia/controller_status_ocorrencia.js")
const controller_usuario_registro = require("../controller_usuario/controller_usuario.js")

const validarDados = async function(dados){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(dados.descricao == undefined || dados.descricao == null || dados.descricao.length > 500){
         customMessage.ERROR_BAD_REQUEST.field = "[DESCRIÇÃO OCORRENCIA] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.data_hora == undefined || dados.data_hora == null || dados.data_hora == "" || dados.data_hora.length != 19){
         customMessage.ERROR_BAD_REQUEST.field = "[DATA E HORA OCORRENCIA] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_setor == undefined || dados.id_setor == null || String(dados.id_setor).replaceAll(' ', '') == ''  || dados.id_setor == "" || isNaN(dados.id_setor) || dados.id_setor <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID SETOR OCORREINCIA] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_funcionario == undefined || dados.id_funcionario == null || String(dados.id_funcionario).replaceAll(' ', '') == ''  || dados.id_funcionario == "" || isNaN(dados.id_funcionario) || dados.id_funcionario <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID FUNCIONARIO OCORRENCIA] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_motivo_ocorrencia == undefined || dados.id_motivo_ocorrencia == null || String(dados.id_motivo_ocorrencia).replaceAll(' ', '') == ''  || dados.id_motivo_ocorrencia == "" || isNaN(dados.id_motivo_ocorrencia) || dados.id_motivo_ocorrencia <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID MOTIVO DA OCORRENCIA] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_status_ocorrencia == undefined || dados.id_status_ocorrencia == null || String(dados.id_status_ocorrencia).replaceAll(' ', '') == ''  || dados.id_status_ocorrencia == "" || isNaN(dados.id_status_ocorrencia) || dados.id_status_ocorrencia <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID STATUS OCORRENCIA] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_usuario_registro == undefined || dados.id_usuario_registro == null || String(dados.id_usuario_registro).replaceAll(' ', '') == ''  || dados.id_usuario_registro == "" || isNaN(dados.id_usuario_registro) || dados.id_usuario_registro <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID USUARIO DE REGISTRO OCORRENCIA] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST

    }else{
        return false
    }
}

const tratarDados = async function (dados) {
    dados.descricao = dados.descricao.replaceAll("'", "")
    dados.data_hora = dados.data_hora.replaceAll("'", "")

    return dados
}

const inserirOcorrencia = async function(dados, contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
                    let validar = await validarDados(dados)
        
                    if (!validar) {
        
                        let result = await ocorrenciaDAO.insertOcorrencia(await tratarDados(dados))
        
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
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (Controller)
    }
}

const listarOcorrencia = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await ocorrenciaDAO.selectAllOcorrencia

        if (result) {

            if (result.length > 0) {

                for (let dados of result) {
                   
                    let resultIdSetor = await controller_setor.buscarSetor(dados.id_setor)

                    if (resultIdSetor.status) {
                        dados.setor = resultIdSetor.response.dados

                        delete dados.id_setor
                    } else {
                        return resultIdSetor
                    }


                    let resultFuncionario = await controllerFuncionario.buscarFunfionario(dados.id_funcionario)

                    if (resultFuncionario.status) {
                        dados.setor = resultFuncionario.response.dados

                        delete dados.id_setor
                    } else {
                        return resultFuncionario
                    }

                    let resultStatusFuncionario = await controllerStatusFuncionario.buscarStatusFunfionario(dados.id_status_funcionario)

                    if(resultStatusFuncionario.status){
                        dados.status_funcionario = resultStatusFuncionario.response.dados

                        delete dados.id_status_funcionario
                    }else{
                        return resultStatusFuncionario
                    }

                }


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
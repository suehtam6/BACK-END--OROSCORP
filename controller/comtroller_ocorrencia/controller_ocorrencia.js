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


const idInvalido = (valor) =>
    String(valor).trim() === '' || isNaN(valor) || Number(valor) <= 0

const validarDados = async function (dados) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (dados.descricao == undefined || dados.descricao == null || String(dados.descricao).trim() == '' || dados.descricao.length > 500) {
        customMessage.ERROR_BAD_REQUEST.field = "[DESCRIÇÃO OCORRENCIA] INVALIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else if (dados.id_setor == null || idInvalido(dados.id_setor)) {
        customMessage.ERROR_BAD_REQUEST.field = "[ID SETOR OCORRENCIA] INVALIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else if (dados.id_motivo_ocorrencia == null || idInvalido(dados.id_motivo_ocorrencia)) {
        customMessage.ERROR_BAD_REQUEST.field = "[ID MOTIVO DA OCORRENCIA] INVALIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else if (dados.id_status_ocorrencia == null || idInvalido(dados.id_status_ocorrencia)) {
        customMessage.ERROR_BAD_REQUEST.field = "[ID STATUS OCORRENCIA] INVALIDO"
        return customMessage.ERROR_BAD_REQUEST

        // AQUI EU SO IREI VALIDAR OS QUE NÃO FOREM NULL
    } else if (dados.id_funcionario != null && idInvalido(dados.id_funcionario)) {
        customMessage.ERROR_BAD_REQUEST.field = "[ID FUNCIONARIO OCORRENCIA] INVALIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else if (dados.id_usuario_registro != null && idInvalido(dados.id_usuario_registro)) {
        customMessage.ERROR_BAD_REQUEST.field = "[ID USUARIO DE REGISTRO OCORRENCIA] INVALIDO"
        return customMessage.ERROR_BAD_REQUEST

    } else {
        return false
    }
}

const tratarDados = async function (dados) {
    dados.descricao = dados.descricao.replaceAll("'", "")
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

        let result = await ocorrenciaDAO.selectAllOcorrencia()

        
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
                        dados.funcionario = resultFuncionario.response.dados

                        delete dados.id_funcionario
                    } else if(!resultFuncionario.status){
                        dados.funcionario = null
                    }else{
                        return resultFuncionario
                    }

                    let resultMotivoOcorrencia = await controllerMotivo_ocorrencia.buscarmotivo_ocorrencia(dados.id_motivo_ocorrencia)

                    if(resultMotivoOcorrencia.status){
                        dados.motivo_ocorrencia = resultMotivoOcorrencia.response.dados

                        delete dados.id_motivo_ocorrencia
                    }else{
                        return resultMotivoOcorrencia
                    }

                    let resultStatusOcorrencia = await controller_status_ocorrencia.buscarStatusOcorrencia(dados.id_status_ocorrencia)

                    if(resultStatusOcorrencia.status){
                        dados.id_status_ocorrencia = resultStatusOcorrencia.response.dados

                        delete dados.id_status_ocorrencia
                    }else{
                        return resultStatusOcorrencia
                    }

                    let resultRegistroUsuario = await controller_usuario_registro.buscarUsuario(dados.id_usuario_registro)

                    if(resultRegistroUsuario.status){
                        dados.responsavel = resultRegistroUsuario.response.dados

                        delete dados.id_usuario_registro
                    }else if(!resultRegistroUsuario.status){
                        dados.usuario_registrado = null
                    }else{
                        return resultRegistroUsuario
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

const buscarOcorrencia = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID OCORRENCIA] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await ocorrenciaDAO.selectByIdOcorrencia(id)

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
                        dados.funcionario = resultFuncionario.response.dados

                        delete dados.id_funcionario
                    } else if(!resultFuncionario.status){
                        dados.funcionario = null
                    }else{
                        return resultFuncionario
                    }

                    let resultMotivoOcorrencia = await controllerMotivo_ocorrencia.buscarmotivo_ocorrencia(dados.id_motivo_ocorrencia)

                    if(resultMotivoOcorrencia.status){
                        dados.motivo_ocorrencia = resultMotivoOcorrencia.response.dados

                        delete dados.id_motivo_ocorrencia
                    }else{
                        return resultMotivoOcorrencia
                    }

                    let resultStatusOcorrencia = await controller_status_ocorrencia.buscarStatusOcorrencia(dados.id_status_ocorrencia)

                    if(resultStatusOcorrencia.status){
                        dados.id_status_ocorrencia = resultStatusOcorrencia.response.dados

                        delete dados.id_status_ocorrencia
                    }else{
                        return resultStatusOcorrencia
                    }

                    let resultRegistroUsuario = await controller_usuario_registro.buscarUsuario(dados.id_usuario_registro)

                    if(resultRegistroUsuario.status){
                        dados.responsavel = resultRegistroUsuario.response.dados

                        delete dados.id_usuario_registro
                    }else if(!resultRegistroUsuario.status){
                        dados.usuario_registrado = null
                    }else{
                        return resultRegistroUsuario
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

const atualizarOcorrencia = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarOcorrencia = await buscarOcorrencia(id)

            if(resultBuscarOcorrencia.status){

                if(resultBuscarOcorrencia){


                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await ocorrenciaDAO.updateOcorrencia(dados)

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

const excluirOcorrencia = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await ocorrenciaDAO.deleteOcorrencia(id)
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


module.exports = {
    inserirOcorrencia,
    listarOcorrencia,
    buscarOcorrencia,
    atualizarOcorrencia,
    excluirOcorrencia
}


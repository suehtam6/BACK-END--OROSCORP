/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da câmera
 * Data: 2026/10/07
 * Autor: Matheus Lucas
 * Versão: 1.0
 ******************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const cameraDAO = require('../../model/DAO/camera/camera.js')


// Import das controller para utilizar no Camera
const controllerSetor = require("../controller_setor/controller_setor.js")
const controllerStatusCamera = require("../controller_status_camera/controller_status_camera.js")


const inserirCamera = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await cameraDAO.insertCamera(await tratarDados(dados))

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


const atualizarCamera = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarCamera = await buscarCamera(id)

            if(resultBuscarCamera.status){

                if(resultBuscarCamera){


                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await cameraDAO.updateCamera(dados)

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
                return resultBuscarCamera // RETORNA UM 400
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }


}

const listarCamera = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await cameraDAO.selectAllCamera()
        

        if (result) {

            if (result.length > 0) {

                for (let dados of result) {

                        
                    let resultSetor = await controllerSetor.buscarSetor(dados.id_setor)
                    
                    if (resultSetor.status) {
                        dados.setor = resultSetor.response.dados

                        delete dados.id_setor
                    } else {
                        return resultSetor
                    }

                    
                    let resultStatusCamera = await controllerStatusCamera.buscarStatusCamera(dados.id_status_camera)
                    
                    if (resultStatusCamera.status) {
                        dados.status_camera = resultStatusCamera.response.dados

                        delete dados.id_status_camera
                    } else {
                        return resultStatusCamera
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

const buscarCamera = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID CÂMERA] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await cameraDAO.selectByIdCamera(id)

            if (result) {

                if (result.length > 0) {


                    for (let dados of result) {

                        
                        let resultSetor = await controllerSetor.buscarSetor(dados.id_setor)
                        
                        if (resultSetor.status) {
                            dados.setor = resultSetor.response.dados
    
                            delete dados.id_setor
                        } else {
                            return resultSetor
                        }
    
                        
                        let resultStatusCamera = await controllerStatusCamera.buscarStatusCamera(dados.id_status_camera)
                        
                        if (resultStatusCamera.status) {
                            dados.status_camera = resultStatusCamera.response.dados
    
                            delete dados.id_status_camera
                        } else {
                            return resultStatusCamera
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

const excluirCamera = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await cameraDAO.deleteCamera(id)
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
    } else if ((dados.descricao == undefined || dados.descricao == '' || dados.descricao == null || dados.descricao.length > 256)) {
        customMessage.ERROR_BAD_REQUEST.field = '[DESCRICAO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if ((dados.endereco_stream  == undefined || dados.endereco_stream  == '' || dados.endereco_stream  == null || dados.endereco_stream .length > 256)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ENDERECO STREAM] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    return false
}

const tratarDados = async function (dados) {
    dados.nome = dados.nome.replaceAll("'", "")
    dados.descricao = dados.descricao.replaceAll("'", "")
    dados.endereco_stream  = dados.endereco_stream .replaceAll("'", "")


    return dados
}

module.exports = {
    inserirCamera,
    atualizarCamera,
    listarCamera,
    buscarCamera,
    excluirCamera
}
/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do nivel de acesso
 * Data: 2026/10/01
 * Autor: Nathan Luna
 * Versão: 1.0
 ******************************************************************************************************************/

const configMessages = require("../../controller/modulo/configMessages")

const status_funcionarioDAO = require("../../model/DAO/status_funcionario/status funcionario.js")

const validarDados = async function(dados){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(dados.status == undefined || dados.status == null || dados.status > 20){
        return customMessage.ERROR_BAD_REQUEST.field = "[STATOS FUNCIONARIO] INVALIDO"
    }else{
        return false
    }

}

const tratarDados = async function (dados) {
    dados.status = dados.status.replaceAll("'", "")

    return dados
}


const inserirStatusFuncionario = async function(dados, contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
                    let validar = await validarDados(dados)
        
                    if (!validar) {
        
                        let result = await status_funcionarioDAO.insertStatusFuncionario(await tratarDados(dados))
        
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

const buscarStatusFunfionario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await status_funcionarioDAO.selectByIdStatosFuncionario(id)

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


const atualuzarStatusFuncionario = async function(dados, id, contentType){
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
                // Validando o content type, para saber se é um JSON que está sendo enviado.
                if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
        
                    let resultBuscarStatusFunfionario = await buscarStatusFunfionario(id)
        
                    if(resultBuscarStatusFunfionario.status){
        
                        if(resultBuscarStatusFunfionario){
        
                            let validar = await validarDados(await tratarDados(dados))
        
                            if(!validar){
        
                                dados.id = Number(id)
        
                                let result = await status_funcionarioDAO.updateStatusFuncionario(dados)
        
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
                        return resultBuscarStatusConta // RETORNA UM 400
                    }
        
                }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }
}

const listarStatusFuncionario = async function () {
    
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await status_funcionarioDAO.selectAllStatusFuncionario()

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

        }else {            
            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
        }

    } catch (error) {
        console.log(error);
        
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }
}

const excluirStatusFuncionario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await status_funcionarioDAO.deleteStatosFuncionario(id)
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

module.exports ={
    inserirStatusFuncionario,
    buscarStatusFunfionario,
    atualuzarStatusFuncionario,
    listarStatusFuncionario,
    excluirStatusFuncionario
}
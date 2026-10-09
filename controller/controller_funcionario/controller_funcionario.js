/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do nivel de acesso
 * Data: 2026/10/01
 * Autor: Nathan Luna
 * Versão: 1.0
 ******************************************************************************************************************/

const configMessages = require("../../controller/modulo/configMessages")

const funcionarioDAO = require("../../model/DAO/funcionario/funcionario.js")
const controllerCargo = require("../controller_cargo/controller_cargo.js")
const controllerSetor = require("../controller_setor/controller_setor.js")
const controllerStatusFuncionario = require ("../controller_status_funcionario/controller_status_funcionario.js")

const validarDados = async function(dados){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(dados.nome == undefined || dados.nome == null || dados.nome.length > 80){
         customMessage.ERROR_BAD_REQUEST.field = "[NOME FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.data_nascimento == undefined || dados.data_nascimento == null || dados.data_nascimento == "" || dados.data_nascimento.length != 10){
         customMessage.ERROR_BAD_REQUEST.field = "[DATA DE NACIMENTO FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.cpf == undefined || dados.cpf == null || dados.cpf == "" || dados.cpf.length != 14){
         customMessage.ERROR_BAD_REQUEST.field = "[CPF FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.email == undefined || dados.email == null || dados.email == "" || dados.email.length > 256){
         customMessage.ERROR_BAD_REQUEST.field = "[EMAIL FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.foto == undefined || dados.foto == null || dados.foto == "" || dados.foto.length > 256){
         customMessage.ERROR_BAD_REQUEST.field = "[FOTO FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_cargo == undefined || dados.id_cargo == null || String(dados.id_cargo).replaceAll(' ', '') == ''  || dados.id_cargo == "" || isNaN(dados.id_cargo) || dados.id_cargo <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID CARGO FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST

    }else if(dados.id_setor == undefined || dados.id_setor == null || String(dados.id_setor).replaceAll(' ', '') == ''  || dados.id_setor == "" || isNaN(dados.id_setor) || dados.id_setor <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID SETOR FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST

    }else if(dados.id_status_funcionario == undefined || dados.id_status_funcionario == null || String(dados.id_status_funcionario).replaceAll(' ', '') == ''  || dados.id_status_funcionario == "" || isNaN(dados.id_status_funcionario) || dados.id_status_funcionario <= 0){
         customMessage.ERROR_BAD_REQUEST.field = "[ID STATUS DO FUNCIONARIO] INVALIDO"
         return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

const tratarDados = async function (dados) {
    dados.nome = dados.nome.replaceAll("'", "")
    dados.data_nascimento = dados.data_nascimento.replaceAll("'", "")
    dados.cpf = dados.cpf.replaceAll("'", "")
    dados.email = dados.email.replaceAll("'", "")
    dados.foto = dados.foto.replaceAll("'", "")
    
    return dados
}

const inserirFuncionario = async function(dados, contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
                    let validar = await validarDados(dados)
        
                    if (!validar) {
        
                        let result = await funcionarioDAO.insertFuncionario(await tratarDados(dados))
        
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


const listarFuncionario = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await funcionarioDAO.selectAllFuncionario()

        if (result) {

            if (result.length > 0) {

                for (let dados of result) {
                   
                    let resultFuncionarioCargo = await controllerCargo.buscarCargo(dados.id_cargo)

                    if (resultFuncionarioCargo.status) {
                        dados.cargo = resultFuncionarioCargo.response.dados

                        delete dados.id_cargo
                    } else {
                        return resultFuncionarioCargo
                    }


                    let resultSetorFuncionario = await controllerSetor.buscarSetor(dados.id_setor)

                    if (resultSetorFuncionario.status) {
                        dados.setor = resultSetorFuncionario.response.dados

                        delete dados.id_setor
                    } else {
                        return resultSetorFuncionario
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


const buscarFunfionario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID FUNCIONARIO] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await funcionarioDAO.selectByIdFuncionario(id)

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


const atualuzarFuncionario = async function(dados, id, contentType){
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
                // Validando o content type, para saber se é um JSON que está sendo enviado.
                if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
        
                    let resultBuscarFunfionario = await buscarFunfionario(id)
        
                    console.log(resultBuscarFunfionario);
                    
                    
                    if(resultBuscarFunfionario.status){
        
                        if(resultBuscarFunfionario){
        
                            let validar = await validarDados(await tratarDados(dados))
        
                            if(!validar){
        
                                dados.id = Number(id)
        
                                let result = await funcionarioDAO.updateFuncionario(dados)
        
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
                        return resultBuscarFunfionario // RETORNA UM 400
                    }
        
                }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }
}


const excluirFuncionario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await funcionarioDAO.deleteFuncionario(id)
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





module.exports = {
    inserirFuncionario,
    listarFuncionario,
    buscarFunfionario,
    atualuzarFuncionario,
    excluirFuncionario
}
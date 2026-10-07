/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do nivel de acesso
 * Data: 2026/10/01
 * Autor: Nathan Luna
 * Versão: 1.0
 ******************************************************************************************************************/

const configMessages = require("../../controller/modulo/configMessages")

const funcionarioDAO = require("../../model/DAO/funcionario/funcionario.js")

const validarDados = async function(dados){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(dados.nome == undefined || dados.nome == null || dados.nome > 80){
        return customMessage.ERROR_BAD_REQUEST.field = "[NOME FUNCIONARIO] INVALIDO"
    }else if(dados.data_nascimento == undefined || dados.data_nascimento == null || dados.data_nascimento == "" || dados.data_nascimento.length != 10){
        return customMessage.ERROR_BAD_REQUEST.field = "[DATA DE NACIMENTO FUNCIONARIO] INVALIDO"
    }else if(dados.cpf == undefined || dados.cpf == null || dados.cpf == "" || dados.cpf.length != 15 || isNaN(dados.cpf)){
        return customMessage.ERROR_BAD_REQUEST.field = "[CPF FUNCIONARIO] INVALIDO"
    }else if(dados.email == undefined || dados.email == null || dados.email == "" || dados.email.length > 256){
        return customMessage.ERROR_BAD_REQUEST.field = "[EMAIL FUNCIONARIO] INVALIDO"
    }else if(dados.foto == undefined || dados.foto == null || dados.foto == "" || dados.foto.length > 256){
        return customMessage.ERROR_BAD_REQUEST.field = "[FOTO FUNCIONARIO] INVALIDO"
    }else if(dados.id_cargo == undefined || dados.id_cargo == null || String(dados.id_cargo).replaceAll(' ', '') == ''  || dados.id_cargo == "" || isNaN(dados.id_cargo) || dados.id_cargo <= 0){
        return customMessage.ERROR_BAD_REQUEST.field = "[ID CARGO FUNCIONARIO] INVALIDO"
    }else if(dados.id_setor == undefined || dados.id_setor == null || String(dados.id_setor).replaceAll(' ', '') == ''  || dados.id_setor == "" || isNaN(dados.id_setor) || dados.id_setor <= 0){
        return customMessage.ERROR_BAD_REQUEST.field = "[ID SETOR FUNCIONARIO] INVALIDO"
    }else if(dados.id_status_funcionario == undefined || dados.id_status_funcionario == null || String(dados.id_status_funcionario).replaceAll(' ', '') == ''  || dados.id_status_funcionario == "" || isNaN(dados.id_status_funcionario) || dados.id_status_funcionario <= 0){
        return customMessage.ERROR_BAD_REQUEST.field = "[ID STATUS DO FUNCIONARIO] INVALIDO"
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


const atualuzarFuncionario = async function(dados, id, contentType){
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
                // Validando o content type, para saber se é um JSON que está sendo enviado.
                if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
        
                    let resultBuscarStatusFunfionario = await buscarFunfionario(id)
        
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



const buscarFunfionario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
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


const listarFuncionario = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await funcionarioDAO.selectAllFuncionario()

        if (result) {

            if (result.length > 0) {

                for (dados of result) {
                   
                    let resultUsuarioNivelAcesso = await controllerNivelAcesso.buscarNivelAcesso(dados.id_nivel_acesso)

                    if (resultUsuarioNivelAcesso.status) {
                        dados.nivel_acesso = resultUsuarioNivelAcesso.response.dados

                        delete dados.id_nivel_acesso
                    } else {
                        return resultUsuarioNivelAcesso
                    }


                    let resultUsuarioStatusConta = await controllerStatusConta.buscarStatusConta(dados.id_status_conta)

                    if (resultUsuarioStatusConta.status) {
                        dados.status_conta = resultUsuarioStatusConta.response.dados

                        delete dados.id_status_conta
                    } else {
                        return resultUsuarioNivelAcesso
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







const excluirFuncionario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await funcionarioDAO.deleteFuncionario(id)
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
    inserirFuncionario,
    buscarFunfionario,
    excluirFuncionario
}
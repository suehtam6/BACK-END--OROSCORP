/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do usuário
 * Data: 2026/10/01
 * Autor: Matheus Lucas
 * Versão: 1.0
 ******************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const usuarioDAO = require('../../model/DAO/usuario/usuario.js')


// Import das controller para utilizar no usuario
const controllerNivelAcesso = require("../controller_nivel_acesso/controller_nivel_acesso.js")
const controllerStatusConta = require("../controller_status_conta/controller_status_conta.js")



const inserirUsuario = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await usuarioDAO.insertUsuario(await tratarDados(dados))

                if (result) {
                    dados.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATE_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATE_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = dados
                    return customMessage.DEFAULT_MESSAGE // RETORNA UM 201

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


const atualizarUsuario = async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarUsuario = await buscarUsuario(id)

            if(resultBuscarUsuario.status){

                if(resultBuscarUsuario){


                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await usuarioDAO.updateUsuario(dados)

                        if(result){

                            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                            customMessage.DEFAULT_MESSAGE.response = dados
                            return customMessage.DEFAULT_MESSAGE //RETORNA 200


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

const listarUsuario = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await usuarioDAO.selectAllUsuario()

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


                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code // RETORNA UM 200
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.dados = result

                return customMessage.DEFAULT_MESSAGE // RETORNA UM 200

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

const buscarUsuario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await usuarioDAO.selectByIdUsuario(id)

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







                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.dados = result

                    return customMessage.DEFAULT_MESSAGE // RETORNA UM 200



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

const excluirUsuario = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await usuarioDAO.deleteUsuario(id)
        if (result) {

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE // RETORNA UM 200


        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }

}

const validarDados = async function (dados) {
    if (dados.nome == undefined || dados.nome == '' || dados.nome == null || dados.nome.length > 100) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if((dados.foto == undefined || dados.foto == '' || dados.foto == null || dados.foto.length > 256)){
        ustomMessage.ERROR_BAD_REQUEST.field = '[FOTO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if((dados.email == undefined || dados.email == '' || dados.email == null || dados.email.length > 256)){
        customMessage.ERROR_BAD_REQUEST.field = '[E-MAIL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if((dados.senha == undefined || dados.senha == '' || dados.senha == null || dados.senha.length > 516)){
        customMessage.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if (dados.data_nascimento == undefined || dados.data_nascimento == '' || dados.data_nascimento == null || dados.data_nascimento.length != 10) {
        customMessage.ERROR_BAD_REQUEST.field = '[DATA NASCIMENTO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_nivel_acesso == undefined || String(dados.id_nivel_acesso).replaceAll(' ', '') == '' || dados.id_nivel_acesso == null || isNaN(dados.id_nivel_acesso) || dados.id_nivel_acesso <= 0){
        customMessage.ERROR_BAD_REQUEST.field = '[ID DE NIVEL DE ACESSO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(dados.id_status_conta == undefined || String(dados.id_status_conta).replaceAll(' ', '') == '' || dados.id_status_conta == null || isNaN(dados.id_status_conta) || dados.id_status_conta <= 0){
        customMessage.ERROR_BAD_REQUEST.field = '[ID DO STATUS DA CONTA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }
}

const tratarDados = async function (dados) {
    dados.nome == dados.nome.replaceAll("'", ""),
    dados.foto == dados.foto.replaceAll("'", ""),
    dados.email == dados.email.replaceAll("'", ""),
    dados.senha == dados.senha.replaceAll("'", ""),
    dados.data_nascimento == dados.data_nascimento.replaceAll("'", "")


    return dados
}

module.exports = {
    inserirUsuario,
    atualizarUsuario,
    listarUsuario,
    buscarUsuario,
    excluirUsuario
}
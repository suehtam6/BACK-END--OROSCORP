/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do ADM
 * Data: 2026/10/06
 * Autor: Matheus Lucas
 * Versão: 1.0
 ******************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const admDAO = require('../../model/DAO/adm/adm.js')


// Import das controller para utilizar no usuario
const controllerUsuario = require('../controller_usuario/controller_usuario.js')


const inserirADM = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))


    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(dados)

            if (!validar) {

                let result = await admDAO.insertADM(await tratarDados(dados))

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
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (Controller)
    }

}


const atualizarADM= async function (dados, id, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarADM= await buscarADM(id)

            if(resultBuscarADM.status){

                if(resultBuscarADM){


                    let validar = await validarDados(await tratarDados(dados))

                    if(!validar){

                        dados.id = Number(id)

                        let result = await admDAO.updateADM(dados)

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

const listarADM = async function () {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    // Ele converte um objeto para string e depois transforma em um outro objeto.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await admDAO.selectAllADM()

        if (result) {

            if (result.length > 0) {

                for (dados of result) {
                   
                    let resultUsuario = await controllerUsuario.buscarUsuario(dados.id_usuario)
                   
                    if (resultUsuario.status) {
                        dados.usuario = resultUsuario.response.dados

                        delete dados.id_usuario
                    } else {
                        return resultUsuario
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

const buscarADM = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await admDAO.selectByIdADM(id)

            if (result) {

                if (result.length > 0) {


                
                for (dados of result) {
                   
                    let resultUsuario = await controllerUsuario.buscarUsuario(dados.id_usuario)
                    console.log(resultUsuario)
                    if (resultUsuario.status) {
                        dados.usuario = resultUsuario.response.dados

                        delete dados.id_usuario
                    } else {
                        return resultUsuario
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

const excluirADM = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await usuarioDAO.deleteADM(id)
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
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (dados.cnpj == undefined || dados.cnpj == '' || dados.cnpj == null || dados.cnpj > 20) {
        customMessage.ERROR_BAD_REQUEST.field = '[CNPJ] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if ((dados.razao_social == undefined || dados.razao_social == '' || dados.razao_social == null || dados.razao_social.length > 80)) {
        customMessage.ERROR_BAD_REQUEST.field = '[RAZAO_SOCIAL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (dados.id_usuario == undefined || String(dados.id_usuario).replaceAll(' ', '') == '' || dados.id_usuario == null || isNaN(dados.id_usuario) || dados.id_usuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID DO USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    return false
}

const tratarDados = async function (dados) {
    dados.cnpj = dados.cnpj.replaceAll("'", "")
    dados.razao_social = dados.razao_social.replaceAll("'", "")

    return dados
}

module.exports = {
    inserirADM,
    atualizarADM,
    listarADM,
    buscarADM,
    excluirADM
}
/**************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da tabela 
 * intermediaria de setor e EPI.
 * Data: 2026/10/20
 * Autor: Estephano Borovicz Bisneto
 * Versão: 1.0
 *************************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

const setorEpiDAO = require('../../model/DAO/setor_epi/setor_epi.js')

// Import das controllers
const controller_setor = require('../controller_setor/controller_setor.js')
const controller_epi = require('../controller_epi/controller_epi.js')


const inserirSetorEpi = async function (dados, contentType) {
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(dados)

            if (!validar) {

                let result = await setorEpiDAO.insertSetorEpi(dados)

                if (result) {

                    dados.id = result

                    customMessage.DEFAULT_MESSAGE.ESTEPHANO.status = customMessage.SUCCESS_CREATE_ITEM.status
                    customMessage.DEFAULT_MESSAGE.ESTEPHANO.status_code = customMessage.SUCCESS_CREATE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.ESTEPHANO.message = customMessage.SUCCESS_CREATE_ITEM.message
                    customMessage.DEFAULT_MESSAGE.ESTEPHANO.response = dados

                    return customMessage.DEFAULT_MESSAGE.ESTEPHANO // RETORNA UM 201
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


const atualizarSetorEpi = async function (dados, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validando o content type, para saber se é um JSON que está sendo enviado.
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarSetorEpi = await buscarSetorEpi(id)

            if(resultBuscarSetorEpi.status){

                if(resultBuscarSetorEpi){

                    let validar = await validarDados(dados)

                    if(!validar){

                        dados.id = Number(id)

                        let result = await setorEpiDAO.updateSetorEpi(dados)

                        if(result){

                            customMessage.DEFAULT_MESSAGE.ESTEPHANO.status = customMessage.SUCCESS_UPDATED_ITEM.status
                            customMessage.DEFAULT_MESSAGE.ESTEPHANO.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                            customMessage.DEFAULT_MESSAGE.ESTEPHANO.message = customMessage.SUCCESS_UPDATED_ITEM.message
                            customMessage.DEFAULT_MESSAGE.ESTEPHANO.response = dados
                            return customMessage.DEFAULT_MESSAGE.ESTEPHANO //RETORNA 200


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

const listarSetorEpi = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await setorEpiDAO.selectAllSetorEpi()

        if (result) {

            if (result.length > 0) {

                for(let dados of result){

                    let resultSetor = await controller_setor.buscarSetor(dados.id_setor)

                    if(resultSetor.status){
                        dados.setor = resultSetor.response.dados

                        delete dados.id_setor
                    }else{
                        return resultSetor
                    }

                    let resultEPI = await controller_epi.buscarEPI(dados.id_epi)

                    if(resultEPI.status){
                        dados.epi = resultEPI.response.dados

                        delete dados.id_epi
                    }else{
                        return resultEPI
                    }

                }

                customMessage.DEFAULT_MESSAGE.ESTEPHANO.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.ESTEPHANO.status_code = customMessage.SUCCESS_RESPONSE.status_code // RETORNA UM 200
                customMessage.DEFAULT_MESSAGE.ESTEPHANO.response.count = result.length
                customMessage.DEFAULT_MESSAGE.ESTEPHANO.response.dados = result

                return customMessage.DEFAULT_MESSAGE.ESTEPHANO // RETORNA UM 200

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

const buscarSetorEpi = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400

        } else {

            let result = await setorEpiDAO.selectByIdSetorEpi(id)

            if (result) {

                if (result.length > 0) {

                    for(let dados of result){

                        let resultSetor = await controller_setor.buscarSetor(id_setor)
    
                        if(resultSetor.status){
                            dados.setor = resultSetor.response.dados
    
                            delete dados.id_setor
                        }else{
                            return resultSetor
                        }
    
                        let resultEpi = await controller_epi.buscarEPI(id_epi)
    
                        if(resultEpi.status){
                            dados.epi = resultEpi.response.dados
    
                            delete dados.id_epi
                        }else{
                            return resultEpi
                        }
    
                    }

                    customMessage.DEFAULT_MESSAGE.ESTEPHANO.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.ESTEPHANO.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.ESTEPHANO.response.dados = result

                    return customMessage.DEFAULT_MESSAGE.ESTEPHANO // RETORNA UM 200



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

const excluirSetorEpi = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await setorEpiDAO.deleteSetorEpi(id)
        if (result) {

            customMessage.DEFAULT_MESSAGE.ESTEPHANO.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE.ESTEPHANO.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.ESTEPHANO.message = customMessage.SUCCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE.ESTEPHANO // RETORNA UM 200

        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }

}

const validarDados = async function (dados) {
    if (dados.id_epi == undefined || String(dados.id_epi).replaceAll(' ', '') == '' || dados.id_epi == null || isNaN(dados.id_epi) || dados.id_epi <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID EPI] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (dados.id_setor == undefined || String(dados.id_setor).replaceAll(' ', '') == '' || dados.id_setor == null || isNaN(dados.id_setor) || dados.id_setor <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID SETOR] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }

}

module.exports = {
    inserirSetorEpi,
    atualizarSetorEpi,
    listarSetorEpi,
    buscarSetorEpi,
    excluirSetorEpi
}
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


//Função para inserir um novo SetorEpi
const inserirNovoSetorEpi = async function (setorEpi) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let validar = await validarDados(setorEpi)

        if (validar) {
            return validar // RETORNA UM 400 (VALIDAR)
        } else {
    
            let result = await setorEpiDAO.insertSetorEpi(setorEpi)
            if (result) {
                setorEpi.id = result
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.status = customMessage.SUCCESS_CREATE_ITEM.status
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.status_code = customMessage.SUCCESS_CREATE_ITEM.status_code
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.message = customMessage.SUCCESS_CREATE_ITEM.message
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.response = setorEpi
                return customMessage.DEFAULT_MESSAGE_ESTEPHANO // RETORNA UM 201
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //RETORNA UM 500 (MODEL)
            }
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA 500(CONTROLLER)
    }
}

//Função para atualizar um SetorEpi
const atualizarSetorEpi = async function (setorEpi, id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Enviando para a função buscarGenero para saber se este id existe
        let resultBuscarSetorEpi = await buscarSetorEpi(id)

        //Verificando se o que esta retornando é um true
        if (resultBuscarSetorEpi.status) {

            if (resultBuscarSetorEpi) {
                //Validando os SetorResponsavel
                let validar = await validarDados(setorEpi)

                if (!validar) {

                    setorEpi.id = Number(id)

                    let result = await setorEpiDAO.updateSetorEpi(setorEpi)
                    if (result) {
                        customMessage.DEFAULT_MESSAGE_ESTEPHANO.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE_ESTEPHANO.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE_ESTEPHANO.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE_ESTEPHANO.response = setorEpi
                        return customMessage.DEFAULT_MESSAGE_ESTEPHANO //RETORNA 200
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA 500 (MODEL)
                    }
                } 
            } 

        } else {
            return resultBuscarSetorEpi // RETORNA UM 400 E UM 404
        } 
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }

}

const listarSetorEpi = async function () {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await setorEpiDAO.selectAllSetorEpi()
        // Verificando se o conteúdo executou o script
        if (result) {
            // Verificando se o conteúdo está vazio
            if (result.length > 0) {

                for (let dados of result) {
                   
                    let resultSetor = await controller_setor.buscarSetor(dados.id_setor)
                    
                    if(resultSetor.status) {
                        dados.setor = resultSetor.response.dados

                        delete dados.id_setor
                    } else {
                        return resultSetor
                    }

                    let resultEpi = await controller_epi.buscarEPI(dados.id_epi)
                   
                    if (resultEpi.status) {
                        dados.epi = resultEpi.response.dados

                        delete dados.id_epi
                    } else {
                        return resultEpi
                    }
                }
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.status_code = customMessage.SUCCESS_RESPONSE.status_code // RETORNA UM 200
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.response.count = result.length
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.response.setor = result

                return customMessage.DEFAULT_MESSAGE_ESTEPHANO // RETORNA UM 200
            } else {
                return customMessage.ERROR_NOT_FOUND // RETORNA UM 404
            }

        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500(CONTROLLER)
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


                    for (let dados of result) {
                   
                        let resultSetor = await controller_setor.buscarSetor(dados.id_setor)
                        
                        if(resultSetor.status) {
                            dados.setor = resultSetor.response.dados
    
                            delete dados.id_setor
                        } else {
                            return resultSetor
                        }
    
                        let resultEpi = await controller_epi.buscarEPI(dados.id_epi)
                       
                        if (resultEpi.status) {
                            dados.epi = resultEpi.response.dados
    
                            delete dados.id_epi
                        } else {
                            return resultEpi
                        }
                    }

                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.response.setor_responsavel = result

                    return customMessage.DEFAULT_MESSAGE_ESTEPHANO // RETORNA UM 200
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


//Função para buscar um Genero pelo ID do filme
const buscarEpiIdSetor = async function (idSetor) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idSetor == undefined || String(idSetor).replaceAll(' ', '') == '' || idSetor == null || isNaN(idSetor) || idSetor <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_setor] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400
        } else {

            let result = await setorEpiDAO.selectByEpiIdSetor(idSetor)
            if (result) {

                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.response.setor_responsavel = result

                    return customMessage.DEFAULT_MESSAGE_ESTEPHANO // RETORNA UM 200
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


//Função para buscar um filme pelo ID do gênero
const buscarSetorIdEpi = async function (idEpi) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idEpi == undefined || String(idEpi).replaceAll(' ', '') == '' || idEpi == null || isNaN(idEpi) || idEpi <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[id_epi] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400
        } else {

            let result = await setorEpiDAO.selectBySetorIdEpi(idEpi)
            
            if (result) {

                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_ESTEPHANO.response.setor_responsavel = result

                    return customMessage.DEFAULT_MESSAGE_ESTEPHANO // RETORNA UM 200
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
        let resultBuscarSetorEpi = await buscarSetorEpi(id)
        if (resultBuscarSetorEpi.status) {

            let result = await setorEpiDAO.deleteSetorEpi(id)

            if (result) {

                customMessage.DEFAULT_MESSAGE_ESTEPHANO.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE_ESTEPHANO.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE_ESTEPHANO
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
            }
        } else {
            return resultBuscarSetorEpi // RETORNA 400 E 404
        } 
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500(CONTROLLER)
    }
}



const validarDados = async function (setorEpi) {
    if (setorEpi.id_setor == undefined || String(setorEpi.id_setor).replaceAll(' ', '') == '' || setorEpi.id_setor == null || isNaN(setorEpi.id_setor) || setorEpi.id_setor <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID SETOR] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (setorEpi.id_epi == undefined || String(setorEpi.id_epi).replaceAll(' ', '') == '' || setorEpi.id_epi == null || isNaN(setorEpi.id_epi) || setorEpi.id_epi <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID EPI] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }

}

module.exports = {
    inserirNovoSetorEpi,
    listarSetorEpi,
    atualizarSetorEpi,
    buscarSetorEpi,
    buscarEpiIdSetor,
    buscarSetorIdEpi,
    excluirSetorEpi
}
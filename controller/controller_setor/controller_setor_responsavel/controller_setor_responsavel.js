/****************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de SetorResponsavel para realizar o CRUD de setor e responsavel
 * Data: 2026-10-16
 * Autor: Matheus Lucas
 * Versão: 1.0
 *****************************************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../../modulo/configMessages.js')

//Importando o arquivo do DAO para manipular os SetorResponsavel no BD
const SetorResponsavelDAO = require('../../../model/DAO/setor/setor_responsavel/setor_responsavel.js')

//Importando controllers
const controller_setor = require('../controller_setor.js')
const controller_responsavel = require('../../controller_responsavel/controller_responsavel.js')


//Função para inserir um novo SetorResponsavel
const inserirNovoSetorResponsavel = async function (SetorResponsavel) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let validar = await validarDados(SetorResponsavel)

        if (validar) {
            return validar // RETORNA UM 400 (VALIDAR)
        } else {
            // inserindo o novo genero, e tratando o dado para chegar se tem aspas(')
            let result = await SetorResponsavelDAO.insertSetorResponsavel(SetorResponsavel)
            if (result) {
                SetorResponsavel.id = result
                customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_CREATE_ITEM.status
                customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_CREATE_ITEM.status_code
                customMessage.DEFAULT_MESSAGE_MATHEUS.message = customMessage.SUCCESS_CREATE_ITEM.message
                customMessage.DEFAULT_MESSAGE_MATHEUS.response = SetorResponsavel
                return customMessage.DEFAULT_MESSAGE_MATHEUS // RETORNA UM 201
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //RETORNA UM 500 (MODEL)
            }
        }
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA 500(CONTROLLER)
    }
}

//Função para atualizar um SetorResponsavel
const atualizarSetorResponsavel = async function (SetorResponsavel, id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Enviando para a função buscarGenero para saber se este id existe
        let resultBuscarSetorResponsavel = await buscarSetorResponsavel(id)

        //Verificando se o que esta retornando é um true
        if (resultBuscarSetorResponsavel.status) {

            if (resultBuscarSetorResponsavel) {
                //Validando os SetorResponsavel
                let validar = await validarDados(SetorResponsavel)

                if (!validar) {

                    SetorResponsavel.id = Number(id)

                    //Enviando para o updateGenero para atualizar o filme, se o que retornar for um true ele vai 
                    // Mostrar a mensagem de sucesso, caso contrario irá mostrar o que falhou
                    let result = await SetorResponsavelDAO.updateSetorResponsavel(SetorResponsavel)
                    if (result) {
                        customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE_MATHEUS.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE_MATHEUS.response = SetorResponsavel
                        return customMessage.DEFAULT_MESSAGE_MATHEUS //RETORNA 200
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA 500 (MODEL)
                    }
                } // FECHA IF RESULT
            } // FECHA IF resultBuscarSetorResponsavel

        } else {
            return resultBuscarSetorResponsavel // RETORNA UM 400 E UM 404 do buscarGenero
        } // FECHA IF resultBuscarSetorResponsavel.status

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }

}

//Função para listar os SetorResponsavel
const listarSetorResponsavel = async function () {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await SetorResponsavelDAO.selectAllSetorResponsavel()
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

                    let resultResponsavel = await controller_responsavel.buscarResponsavel(dados.id_responsavel)
                   
                    if (resultResponsavel.status) {
                        dados.responsavel = resultResponsavel.response.dados

                        delete dados.id_responsavel
                    } else {
                        return resultResponsavel
                    }



                }



                customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_RESPONSE.status_code // RETORNA UM 200
                customMessage.DEFAULT_MESSAGE_MATHEUS.response.count = result.length
                customMessage.DEFAULT_MESSAGE_MATHEUS.response.setor = result

                return customMessage.DEFAULT_MESSAGE_MATHEUS // RETORNA UM 200
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

//Função para buscar um SetorResponsavel
const buscarSetorResponsavel = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400
        } else {

            let result = await SetorResponsavelDAO.selectByIdSetorResponsavel(id)
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
    
                        let resultResponsavel = await controller_responsavel.buscarResponsavel(dados.id_responsavel)
                       
                        if (resultResponsavel.status) {
                            dados.responsavel = resultResponsavel.response.dados
    
                            delete dados.id_responsavel
                        } else {
                            return resultResponsavel
                        }
    
    
    
                    }


                    customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_MATHEUS.response.setor_responsavel = result

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


//Função para buscar um Genero pelo ID do filme
const buscarResponsavelIdSetor = async function (idSetor) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idSetor == undefined || String(idSetor).replaceAll(' ', '') == '' || idSetor == null || isNaN(idSetor) || idSetor <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_setor] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400
        } else {

            let result = await SetorResponsavelDAO.selectByResponsavelIdSetor(idSetor)
            if (result) {

                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_MATHEUS.response.setor_responsavel = result

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


//Função para buscar um filme pelo ID do gênero
const buscarSetorIdResponsavel = async function (idResponsavel) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idResponsavel == undefined || String(idResponsavel).replaceAll(' ', '') == '' || idResponsavel == null || isNaN(idResponsavel) || idResponsavel <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[id_responsavel] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST // RETORNA UM 400
        } else {

            let result = await SetorResponsavelDAO.selectBySetorIdResponsavel(idResponsavel)
            
            if (result) {

                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE_MATHEUS.response.setor_responsavel = result

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


//Função para excluir um SetorResponsavel
const excluirSetorResponsavel = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarSetorResponsavel = await buscarSetorResponsavel(id)
        if (resultBuscarSetorResponsavel.status) {

            let result = await SetorResponsavelDAO.deleteSetorResponsavel(id)

            if (result) {

                customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE_MATHEUS.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE_MATHEUS
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL // RETORNA UM 500 (MODEL)
            }
        } else {
            return resultBuscarSetorResponsavel // RETORNA 400 E 404
        } // FECHA IF resultBuscarSetorResponsavel.status
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500(CONTROLLER)
    }
}



const validarDados = async function (SetorResponsavel) {
    if (SetorResponsavel.id_setor == undefined || String(SetorResponsavel.id_setor).replaceAll(' ', '') == '' || SetorResponsavel.id_setor == null || isNaN(SetorResponsavel.id_setor) || SetorResponsavel.id_setor <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID SETOR] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (SetorResponsavel.id_responsavel == undefined || String(SetorResponsavel.id_responsavel).replaceAll(' ', '') == '' || SetorResponsavel.id_responsavel == null || isNaN(SetorResponsavel.id_responsavel) || SetorResponsavel.id_responsavel <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID RESPONSAVEL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }

}

module.exports = {
    inserirNovoSetorResponsavel,
    listarSetorResponsavel,
    atualizarSetorResponsavel,
    buscarSetorResponsavel,
    buscarResponsavelIdSetor,
    buscarSetorIdResponsavel,
    excluirSetorResponsavel
}
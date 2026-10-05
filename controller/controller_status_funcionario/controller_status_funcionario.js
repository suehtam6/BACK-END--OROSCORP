/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do nivel de acesso
 * Data: 2026/10/01
 * Autor: Nathan Luna
 * Versão: 1.0
 ******************************************************************************************************************/

const configMessages = require("../../controller/modulo/configMessages")

const status_funcionarioDAO = require("../../model/DAO/status_funcionario")

const validarDados = async function(status_funcionario){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(status_funcionario == undefined || status_funcionario == null || status_funcionario > 20){
        return configMessages.ERROR_BAD_REQUEST.field = "[STATOS FUNCIONARIO] INVALIDO"
    }else{
        return false
    }

}


const inserirStatusFuncionario = async function(status_funcionario, contentType){
    let customMessage = JSON

}




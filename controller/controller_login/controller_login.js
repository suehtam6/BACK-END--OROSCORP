/*****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, autenticação e geração de token do login
 * Data: 2026/10/01
 * Autor: Matheus Lucas
 * Versão: 1.0
 ******************************************************************************************************************/

// Import do arquivo de configurações de mensagens do projeto.
const configMessages = require('../modulo/configMessages.js')

// Import do modulo de token.
const tokenModulo = require('../modulo/token.js')

// Import da biblioteca para comparar a senha com o hash salvo no banco.
const bcrypt = require('bcryptjs')

const loginDAO = require('../../model/DAO/login/login.js')


const fazerLogin = async function (dados, contentType) {
    // Fazendo um clone do meu JSON para poder modificar caso seja necessario.
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(dados)

            if (!validar) {

                let resultUsuario = await loginDAO.selectUsuarioPorEmail(dados.email)

                // Importante: a mensagem de erro e a MESMA tanto para email
                // inexistente quanto para senha errada. Isso evita que alguem
                // descubra, por tentativa e erro, quais emails estao cadastrados.
                if (resultUsuario && resultUsuario.length > 0) {

                    let usuario = resultUsuario[0]

                    if (usuario.status_conta.toUpperCase() != 'ATIVO') {
                        customMessage.ERROR_UNAUTHORIZED.message = `Conta com status "${usuario.status_conta}". Acesso bloqueado.`
                        return customMessage.ERROR_UNAUTHORIZED // RETORNA UM 401
                    }

                    let senhaConfere = await bcrypt.compare(dados.senha, usuario.senha)

                    if (senhaConfere) {

                        let token = tokenModulo.gerarToken({
                            id: usuario.id,
                            nivel_acesso: usuario.nivel_acesso
                        })

                        // Nunca devolver a senha (nem o hash) na resposta.
                        delete usuario.senha

                        customMessage.DEFAULT_MESSAGE_MATHEUS.status = customMessage.SUCCESS_RESPONSE.status
                        customMessage.DEFAULT_MESSAGE_MATHEUS.status_code = customMessage.SUCCESS_RESPONSE.status_code
                        customMessage.DEFAULT_MESSAGE_MATHEUS.response.dados = usuario
                        customMessage.DEFAULT_MESSAGE_MATHEUS.response.token = token
                        return customMessage.DEFAULT_MESSAGE_MATHEUS // RETORNA UM 200

                    } else {
                        return customMessage.ERROR_UNAUTHORIZED // RETORNA UM 401
                    }

                } else {
                    return customMessage.ERROR_UNAUTHORIZED // RETORNA UM 401
                }

            } else {
                return validar // RETORNA UM 400
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE // RETORNA UM 415
        }

    } catch (error) {
        console.error(error) 
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // RETORNA UM 500 (CONTROLLER)
    }
}


const validarDados = async function (dados) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (dados.email == undefined || dados.email == '' || dados.email == null || dados.email.length > 256) {
        customMessage.ERROR_BAD_REQUEST.field = '[E-MAIL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (dados.senha == undefined || dados.senha == '' || dados.senha == null || dados.senha.length > 516) {
        customMessage.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    return false
}


module.exports = {
    fazerLogin
}
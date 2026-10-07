/*************************************************************************************
 * Objetivo: Middleware que libera o cadastro do PRIMEIRO usuario sem exigir token,
 *           e passa a exigir token + nivel de acesso ADM para qualquer cadastro
 *           seguinte (depois que ja existir pelo menos um usuario no banco).
 * Autor: Matheus Lucas
 * Data: 2026/10/01
 *
 * Caminho sugerido: modulo/autorizacaoCadastroInicial.js
 *************************************************************************************/

const usuarioDAO = require('../../model/DAO/usuario/usuario.js')
const tokenModulo = require('./token.js')
const configMessages = require('./configMessages.js')

const permitirCadastroInicialOuExigirAdm = async function (request, response, next) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let jaExisteUsuario = await usuarioDAO.existeUsuario()

        if (!jaExisteUsuario) {
            // Ainda nao existe nenhum usuario: libera o cadastro sem exigir token.
            // E assim que o primeiro ADM do sistema consegue ser criado.
            return next()
        }

        // Ja existe pelo menos um usuario: a partir daqui, exige token valido.
        tokenModulo.verificarToken(request, response, function () {

            if (request.usuarioLogado && request.usuarioLogado.nivel_acesso == 'ADM') {
                return next()
            } else {
                return response
                    .status(customMessage.ERROR_FORBIDDEN.status_code)
                    .json(customMessage.ERROR_FORBIDDEN)
            }
        })

    } catch (error) {
        return response
            .status(customMessage.ERROR_INTERNAL_SERVER_CONTROLLER.status_code)
            .json(customMessage.ERROR_INTERNAL_SERVER_CONTROLLER)
    }
}

module.exports = {
    permitirCadastroInicialOuExigirAdm
}
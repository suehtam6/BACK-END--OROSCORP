/*************************************************************************************
 * Objetivo: Modulo responsavel por gerar e verificar o token JWT de autenticacao
 * Autor: Matheus Lucas
 * Data: 2026/10/01
 *************************************************************************************/

// Import da biblioteca para gerar/verificar o JSON Web Token.
const jwt = require('jsonwebtoken')

// Gera um token assinado com a chave secreta do .env, valido por 8 horas.
// payload deve conter so o minimo necessario para identificar e autorizar
// o usuario (id e nivel_acesso) - nunca senha nem dados sensiveis.
const gerarToken = function (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })
}

// Middleware do Express. Roda ANTES da controller de qualquer rota protegida.
// Confere se o token foi enviado no header Authorization (formato "Bearer <token>")
// e se a assinatura e valida. Se estiver tudo certo, libera a requisicao e
// disponibiliza os dados do usuario logado em request.usuarioLogado.
const verificarToken = function (request, response, next) {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return response.status(401).json({
            status: false,
            status_code: 401,
            message: 'Token nao informado.'
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, function (erro, payload) {
        if (erro) {
            return response.status(403).json({
                status: false,
                status_code: 403,
                message: 'Token invalido ou expirado.'
            })
        }

        request.usuarioLogado = payload
        next()
    })
}

module.exports = {
    gerarToken,
    verificarToken
}
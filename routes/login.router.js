/***********************************************************************************************
 * Objetivo: Guardar a rota do endpoint de login
 * Autor: Matheus Lucas
 * Data: 2026/10/01
***********************************************************************************************/

// Import do express, body-parser
const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilizacao do JSON no body das requisicoes.
const bodyParserJSON = bodyParser.json()

// Criando um objeto de rota para os Endpoints de login
const router = express.Router()

// Import da controller
const controllerLogin = require('../controller/controller_login/controller_login.js')


// Endpoint de login - PUBLICO, sem verificarToken (ninguem tem token antes de logar)
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerLogin.fazerLogin(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

// Export do objeto de rotas do login
module.exports = router
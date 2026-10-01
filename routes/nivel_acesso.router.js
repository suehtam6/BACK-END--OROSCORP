/***********************************************************************************************
 * Objetivo: Guardar todas as rotas dos endpoints sobre o nivel de acesso
 * Autor: Matheus Lucas
 * Data: 2026/10/01
***********************************************************************************************/

//Import do express, body-parser
const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON no body das requisições.
const bodyParserJSON = bodyParser.json()

//Criando um objeto de rota para os Endpoints de Genero
const router = express.Router()

//Import da controller
const controllerNivelAcesso = require('../controller/controller_nivel_acesso/controller_nivel_acesso')

// endpoint para o CRUD do filme
router.post('/',bodyParserJSON, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerNivelAcesso.inserirNivelAcesso(dados, contentType)
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar todos os filmes
router.get('/', async function(request, response){
     let result = await controllerNivelAcesso.listarNivelAcesso()
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar um filme pelo id
router.get('/:id', async function(request, response) {
     let id = request.params.id
 
     let result = await controllerNivelAcesso.buscarNivelAcesso(id)
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para atualizar um filme
router.put('/:id', bodyParserJSON, async function(request, response) {
 
     // Recebe o id do registro a ser atualizado.
     let id = request.params.id
 
     // Recebe os dados do body que serão modificados no banco de dados.
     let dados = request.body
 
     // Recebe o content-type da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
     
     // Chama a função para atualizar o filme.
     let result = await controllerNivelAcesso.atualizarNivelAcesso(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })
 
router.delete('/:id', async function (request, response){
     let id = request.params.id
 
     let result = await controllerNivelAcesso.excluirNivelAcesso(id)
 
     response.status(result.status_code)
     response.json(result)
 })

//Export do objeto de rotas do gênero
module.exports = router
/***********************************************************************************************
 * Objetivo: Guardar todas as rotas dos endpoints sobre o Responsavel
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
const controllerResponsavel = require('../controller/controller_responsavel/controller_responsavel.js')


router.post('/',bodyParserJSON, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerResponsavel.inserirResponsavel(dados, contentType)
     response.status(result.status_code)
     response.json(result)
 })
 

router.get('/', async function(request, response){
     let result = await controllerResponsavel.listarResponsavel()
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar um status pelo id
router.get('/:id', async function(request, response) {
     let id = request.params.id
 
     let result = await controllerResponsavel.buscarResponsavel(id)
 
     response.status(result.status_code)
     response.json(result)
 })
 

router.put('/:id', bodyParserJSON, async function(request, response) {
 
     // Recebe o id do registro a ser atualizado.
     let id = request.params.id
 
     // Recebe os dados do body que serão modificados no banco de dados.
     let dados = request.body
 
     // Recebe o content-type da requisição para validar se é JSON.
     let contentType = request.headers['content-type']


     let result = await controllerResponsavel.atualizarResponsavel(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })
 
router.delete('/:id', async function (request, response){
     let id = request.params.id
 
     let result = await controllerResponsavel.excluirResponsavel(id)
 
     response.status(result.status_code)
     response.json(result)
 })


module.exports = router
/***********************************************************************************************
 * Objetivo: Guardar todas as rotas dos endpoints sobre o status da ocorrência.
 * Autor: Estephano Borovicz Bisneto
 * Data: 2026/10/07
***********************************************************************************************/

//Import do express, body-parser
const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON no body das requisições.
const bodyParserJSON = bodyParser.json()

//Criando um objeto de rota para os Endpoints dos status de ocorrência
const router = express.Router()

//Import da controller
const controllerStatusOcorrencia = require('../controller/controller_status_ocorrencia/controller_status_ocorrencia.js')

// endpoint para o CRUD do status de ocorrência
router.post('/',bodyParserJSON, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerStatusOcorrencia.inserirStatusOcorrencia(dados, contentType)
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar todos os status de ocorrência
router.get('/', async function(request, response){
     let result = await controllerStatusOcorrencia.listarStatusOcorrencia()
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar um status de ocorrencia pelo id
router.get('/:id', async function(request, response) {
     let id = request.params.id
 
     let result = await controllerStatusOcorrencia.buscarStatusOcorrencia(id)
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para atualizar um status de ocorrência
router.put('/:id', bodyParserJSON, async function(request, response) {
 
     // Recebe o id do registro a ser atualizado.
     let id = request.params.id
 
     // Recebe os dados do body que serão modificados no banco de dados.
     let dados = request.body
 
     // Recebe o content-type da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
     
     // Chama a função para atualizar o status da conta
     let result = await controllerStatusOcorrencia.atualizarStatusOcorrencia(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })
 
router.delete('/:id', async function (request, response){
     let id = request.params.id
 
     let result = await controllerStatusOcorrencia.excluirStatusOcorrencia(id)
 
     response.status(result.status_code)
     response.json(result)
 })

//Export do objeto de rotas do status de ocorrência
module.exports = router
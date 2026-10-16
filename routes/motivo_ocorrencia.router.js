/***********************************************************************************************
 * Objetivo: Guardar todas as rotas dos endpoints sobre a EPI
 * Autor: Matheus Lucas
 * Data: 2026/10/09
***********************************************************************************************/

//Import do express, body-parser
const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON no body das requisições.
const bodyParserJSON = bodyParser.json()


const router = express.Router()

//Import da controller
const controllerMotivoOcorrencia = require('../controller/controller_motivo_ocorrencia/motivo_ocorrencia.js')


router.post('/',bodyParserJSON, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerMotivoOcorrencia.inserirmotivo_ocorrencia(dados, contentType)
     console.log(result)
     response.status(result.status_code)
     response.json(result)
 })
 
router.get('/', async function(request, response){
     let result = await controllerMotivoOcorrencia.listarmotivo_ocorrencia()
 
     response.status(result.status_code)
     response.json(result)
 })
 
router.get('/:id', async function(request, response) {
     let id = request.params.id
 
     let result = await controllerMotivoOcorrencia.buscarmotivo_ocorrencia(id)
 
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
     
     
     let result = await controllerMotivoOcorrencia.atualizarmotivo_ocorrencia(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })
 
router.delete('/:id', async function (request, response){
     let id = request.params.id
 
     let result = await controllerMotivoOcorrencia.excluirmotivo_ocorrencia(id)
 
     response.status(result.status_code)
     response.json(result)
 })


module.exports = router
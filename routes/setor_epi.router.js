/***********************************************************************************************
 * Objetivo: Guardar todas as rotas dos endpoints sobre o crud de setor e EPI
 * Autor: Estephano Borovicz Bisneto
 * Data: 2026/10/20
***********************************************************************************************/

//Import do express, body-parser
const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON no body das requisições.
const bodyParserJSON = bodyParser.json()

//Criando um objeto de rota para os Endpoints de setor_epi
const router = express.Router()

//Import da controller
const controllerSetorEpi = require('../controller/controller_setor_epi/controller_setor_epi.js')


router.post('/',bodyParserJSON, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerSetorEpi.inserirNovoSetorEpi(dados, contentType)
     response.status(result.status_code)
     response.json(result)
 })
 

router.get('/', async function(request, response){
     let result = await controllerSetorEpi.listarSetorEpi()
 
     response.status(result.status_code)
     response.json(result)
 })
 

router.get('/:id', async function(request, response) {
     let id = request.params.id
 
     let result = await controllerSetorEpi.buscarSetorEpi(id)
 
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
     
     // Chama a função para atualizar o status da conta
     let result = await controllerSetorEpi.atualizarSetorEpi(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })

 
router.delete('/:id', async function (request, response){
     let id = request.params.id
 
     let result = await controllerSetorEpi.excluirSetorEpi(id)
 
     response.status(result.status_code)
     response.json(result)
 })


module.exports = router
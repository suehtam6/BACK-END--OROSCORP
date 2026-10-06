/***********************************************************************************************
 * Objetivo: Guardar todas as rotas dos endpoints sobre o ADM
 * Autor: Matheus Lucas
 * Data: 2026/10/06
***********************************************************************************************/

//Import do express, body-parser
const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON no body das requisições.
const bodyParserJSON = bodyParser.json()

//Criando um objeto de rota para os Endpoints de Genero
const router = express.Router()

//Import da controller
const controllerADM = require('../controller/controller_adm/controller_adm.js')

// endpoint para o CRUD do status
router.post('/',bodyParserJSON, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerADM.inserirADM(dados, contentType)
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar todos os status
router.get('/', async function(request, response){
     let result = await controllerADM.listarADM()
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar um status pelo id
router.get('/:id', async function(request, response) {
     let id = request.params.id
 
     let result = await controllerADM.buscarADM(id)
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para atualizar um status
router.put('/:id', bodyParserJSON, async function(request, response) {
 
     // Recebe o id do registro a ser atualizado.
     let id = request.params.id
 
     // Recebe os dados do body que serão modificados no banco de dados.
     let dados = request.body
 
     // Recebe o content-type da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
     
     // Chama a função para atualizar o status da conta
     let result = await controllerADM.atualizarADM(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })
 
router.delete('/:id', async function (request, response){
     let id = request.params.id
 
     let result = await controllerADM.excluirADM(id)
 
     response.status(result.status_code)
     response.json(result)
 })

//Export do objeto de rotas do status da conta
module.exports = router
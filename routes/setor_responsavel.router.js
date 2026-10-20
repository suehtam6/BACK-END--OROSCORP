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
const controllerSetorResponsavel = require('../controller/controller_setor/controller_setor_responsavel/controller_setor_responsavel.js')

// endpoint para o CRUD do status
router.post('/',bodyParserJSON, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerSetorResponsavel.inserirNovoSetorResponsavel(dados, contentType)
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar todos os status
router.get('/', async function(request, response){
     let result = await controllerSetorResponsavel.listarSetorResponsavel()
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para buscar os dados pelo id
router.get('/:id', async function(request, response) {
     let id = request.params.id
 
     let result = await controllerSetorResponsavel.buscarSetorResponsavel(id)
 
     response.status(result.status_code)
     response.json(result)
 })


// endpoint para buscar os dados do setor pelo id do responsavel
router.get('/setor/responsavel/:id', async function(request, response) {
    let id = request.params.id

    let result = await controllerSetorResponsavel.buscarSetorIdResponsavel(id)

    response.status(result.status_code)
    response.json(result)
})


// endpoint para buscar os dados do responsavel pelo id do setor
router.get('/responsavel/setor/:id', async function(request, response) {
    let id = request.params.id

    let result = await controllerSetorResponsavel.buscarResponsavelIdSetor(id)

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
     let result = await controllerSetorResponsavel.atualizarSetorResponsavel(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })
 
router.delete('/:id', async function (request, response){
     let id = request.params.id
 
     let result = await controllerSetorResponsavel.excluirSetorResponsavel(id)
 
     response.status(result.status_code)
     response.json(result)
 })

//Export do objeto de rotas do status da conta
module.exports = router
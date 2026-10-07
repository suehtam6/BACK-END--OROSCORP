/***********************************************************************************************
 * Objetivo: Guardar todas as rotas dos endpoints sobre o usuário
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
const controllerUsuario = require('../controller/controller_usuario/controller_usuario.js')
const controllerLogin = require('../controller/controller_login/controller_login.js')

// Import do modulo de token e do middleware de cadastro inicial
const tokenModulo = require('../controller/modulo/token.js')
const autorizacaoCadastroInicial = require('../controller/modulo/autorizacaoCadastroInicial.js')


// endpoint para cadastrar usuario.
// Liberado sem token APENAS enquanto nao existir nenhum usuario no banco.
// Depois do primeiro cadastro, passa a exigir token + nivel ADM automaticamente.
router.post('/', bodyParserJSON, autorizacaoCadastroInicial.permitirCadastroInicialOuExigirAdm, async function(request, response){
    // Recebendo o body da requisição
     let  dados = request.body
 
 
     // Recebendo o tipo de dados da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
 
     let result = await controllerUsuario.inserirUsuario(dados, contentType)
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar todos os usuarios - exige estar logado
router.get('/', tokenModulo.verificarToken, async function(request, response){
     let result = await controllerUsuario.listarUsuario()
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para pegar um usuario pelo id - exige estar logado
router.get('/:id', tokenModulo.verificarToken, async function(request, response) {
     let id = request.params.id
 
     let result = await controllerUsuario.buscarUsuario(id)
 
     response.status(result.status_code)
     response.json(result)
 })
 
 // endpoint para atualizar um usuario - exige estar logado
router.put('/:id', bodyParserJSON, tokenModulo.verificarToken, async function(request, response) {
 
     // Recebe o id do registro a ser atualizado.
     let id = request.params.id
 
     // Recebe os dados do body que serão modificados no banco de dados.
     let dados = request.body
 
     // Recebe o content-type da requisição para validar se é JSON.
     let contentType = request.headers['content-type']
     
     // Chama a função para atualizar o status da conta
     let result = await controllerUsuario.atualizarUsuario(dados, id, contentType)
 
     response.status(result.status_code)
     response.json(result)
 })
 
// endpoint para excluir um usuario - exige estar logado
router.delete('/:id', tokenModulo.verificarToken, async function (request, response){
     let id = request.params.id
 
     let result = await controllerUsuario.excluirUsuario(id)
 
     response.status(result.status_code)
     response.json(result)
 })

//Export do objeto de rotas do status da conta
module.exports = router
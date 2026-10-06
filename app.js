/*********************************************************************************************************
 * Objetivo: Arquivo responsável pela criação do bando de dados sobre o TCC
 * Data: 2026/10/01
 * Autor: Matheus Lucas
 * Versão: 1.0
 ********************************************************************************************************/


require('dotenv').config()

// Import das dependencias para criar a API
const express       = require('express')
const cors          = require('cors')


// Criando um objeto do express para criar a API
const app = express()

// Configurações do CORS da API
const corsOptions = {
    origin: ['*'], //Configuração de origem da requisição(IP ou Dominio).
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //Configuração dos verbos que serão utilizados na API.
    allowedHeaders: ['Content-type', 'Authorization'] //Configurações de permissões.
                    //Tipo de dados  //Autorização de acesso 
}



// Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))



// AQUI VAI FICAR AS ROUTES DO PROJETO!!

// IMPORT DO ARQUIVO DE ROTAS SOBRE O NIVEL DE ACESSO
const nivelAcessoRouter = require('./routes/nivel_acesso.router.js')
app.use('/v1/oroscorp/nivel-acesso', cors(), nivelAcessoRouter)

// IMPORT DO ARQUIVO DE ROTAS SOBRE O STATUS DA CONTA
const statusContaRouter = require('./routes/status_conta.router.js')
app.use('/v1/oroscorp/status-conta', cors(), statusContaRouter)

// IMPORT DO ARQUIVO DE ROTAS SOBRE O STATUS DA CONTA
const usuarioRouter = require('./routes/usuario.router.js')
app.use('/v1/oroscorp/usuario', cors(), usuarioRouter)


// IMPORT DO ARQUIVO DA ROTA SOBRE O LOGIN
const loginRouter = require('./routes/login.router.js')
app.use('/v1/oroscorp/login', cors(), loginRouter)



// IMPORT DO ARQUIVO DA ROTA SOBRE O ADM
const admRouter = require('./routes/adm.router.js')
app.use('/v1/oroscorp/administrador', cors(), admRouter)














// Faz um start na API (Aguardando requisição)
app.listen(8080, function(){
    console.log('API aguardando novas requisições...')
})
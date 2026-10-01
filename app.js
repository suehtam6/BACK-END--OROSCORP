/*********************************************************************************************************
 * Objetivo: Arquivo responsável pela criação do bando de dados sobre o TCC
 * Data: 2026/10/01
 * Autor: Matheus Lucas
 * Versão: 1.0
 ********************************************************************************************************/

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

// IMPORT DO ARQUIVO DE ROTAS SOBRE O FILME
const nivelAcessoRouter = require('./routes/nivel_acesso.router')
app.use('/v1/oroscorp/nivel-acesso', cors(), nivelAcessoRouter)












// Faz um start na API (Aguardando requisição)
app.listen(8080, function(){
    console.log('API aguardando novas requisições...')
})
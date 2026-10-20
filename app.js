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

// IMPORT DO ARQUIVO DE ROTAS SOBRE O STATUS_FUNCIONARIO
const status_funcionario = require('./routes/status_funcionario.js')
app.use("/v1/oroscorp/statusfuncionario", cors(), status_funcionario)


// IMPORT DO ARQUIVO DA ROTA SOBRE O RESPONSAVEL
const responsavelRouter = require('./routes/responsavel.router.js')
app.use('/v1/oroscorp/responsavel', cors(), responsavelRouter)


// IMPORT DO ARQUIVO DA ROTA SOBRE O CARGO DO FUNCIONARIO
const cargoRouter = require('./routes/cargo.router.js')
app.use('/v1/oroscorp/cargo', cors(), cargoRouter)

// IMPORT DO ARQUIVO DA ROTA SOBRE O STATUS DO SETOR
const statusSetorRouter = require('./routes/status_setor.router.js')
app.use('/v1/oroscorp/status-setor', cors(), statusSetorRouter)


// IMPORT DO ARQUIVO DA ROTA SOBRE O SETOR
const setorRouter = require('./routes/setor.router.js')
app.use('/v1/oroscorp/setor', cors(), setorRouter)

// IMPORT DO ARQUIVO DA ROTA SOBRE O FUNCIONARIO
const funcionarioRouter = require('./routes/funcionario.router.js')
app.use('/v1/oroscorp/funcionario', cors(), funcionarioRouter)

// IMPORT DO ARQUIVO DA ROTA SOBRE O STATUS DA CÂMERA
const statusCameraRouter = require('./routes/status_camera.router.js')
app.use('/v1/oroscorp/status-camera', cors(), statusCameraRouter)


// IMPORT DO ARQUIVO DA ROTA SOBRE A CÂMERA
const cameraRouter = require('./routes/camera.router.js')
app.use('/v1/oroscorp/camera', cors(), cameraRouter)


// IMPORT DO ARQUIVO DE ROTAS SOBRE O STATUS DA OCORRÊNCIA
const statusOcorrenciaRouter = require('./routes/status_ocorrencia.router.js')
app.use('/v1/oroscorp/status-ocorrencia', cors(), statusOcorrenciaRouter)

// IMPORT DO ARQUIVO DE ROTAS SOBRE O STATUS DA OCORRÊNCIA
const epiRouter = require('./routes/epi.router.js')
app.use('/v1/oroscorp/epi', cors(), epiRouter)

const motivo_ocorrenciaRouter = require('./routes/motivo_ocorrencia.router.js')
app.use('/v1/oroscorp/motivo_ocorrencia', cors(), motivo_ocorrenciaRouter)

const ocorrenciaRouter = require('./routes/ocorrencia.router.js')
app.use('/v1/oroscorp/ocorrencia', cors(), ocorrenciaRouter)

// IMPORT DO ARQUIVO DE ROTAS SOBRE O SETOR E RESPONSAVEL
const setorResponsavelRouter = require('./routes/setor_responsavel.router.js')
app.use('/v1/oroscorp/setor-responsavel', cors(), setorResponsavelRouter)


// IMPORT DO ARQUIVO DE ROTAS SOBRE O SETOR E RESPONSAVEL
const ocorrenciaEPIRouter = require('./routes/ocorrencia_epi.router.js')
app.use('/v1/oroscorp/ocorrencia-epi', cors(), ocorrenciaEPIRouter)



// Faz um start na API (Aguardando requisição)
app.listen(8080, function(){
    console.log('API aguardando novas requisições...')
})
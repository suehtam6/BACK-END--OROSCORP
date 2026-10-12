const express = require('express')
const bodyParser = require('body-parser')
const bodyParserJSON = bodyParser.json()
const router = express.Router()

const controllerIAAlerta = require('../controller/conroller_IA/conteoller_ia.js')

router.post('/', bodyParserJSON, async function(request, response){
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerIAAlerta.receberAlertaIA(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

module.exports = router
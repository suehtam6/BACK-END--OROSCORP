const receberAlertaIA = async function(dados, contentType){
    if (String(contentType).toLowerCase() != 'application/json') {
        return { status: false, status_code: 415, message: 'Content-Type deve ser application/json' }
    }

    if (!dados || dados.alerta !== true || !dados.tipo || !dados.horario) {
        return { status: false, status_code: 400, message: 'JSON de alerta inválido' }
    }

    console.log('Alerta recebido da IA:', dados)

    return { status: true, status_code: 201, message: 'Alerta recebido com sucesso' }
}

module.exports = { receberAlertaIA }
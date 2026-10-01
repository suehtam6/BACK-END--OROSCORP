use db_oroscorp;

#-----------------------------TABELAS DE DOMINIO----------------------------#

update tbl_nivel_acesso set
	nome = "ADM"
    where id = 1
    ;

update tbl_status_conta set
	status = "Ativo"
    where id = 1
    ;

update tbl_status_funcionario set
	status = "Ativo"
    where id = 1
    ;

update tbl_status_setor set
	status = "Ativo"
    where id = 1
    ;

update tbl_status_ocorrencia set
	status = "Aberta"
    where id = 1
    ;

update tbl_motivo_ocorrencia set
	nome = "Ausencia de EPI"
    where id = 1
    ;

update tbl_cargo set
	cargo = "Soldador"
    where id = 1
    ;

update tbl_status_camera set
	status = "Ativa"
    where id = 1
    ;

#-----------------------------TABELAS DE DOMINIO----------------------------#


#-----------------------------USUARIO----------------------------#

update tbl_usuario set
	nome = "Ana Paula Pereira",
    foto = "ana_pereira.jpg",
    email = "ana@oroscorp.com",
    senha = "$2b$12$hashDeExemplo",
    data_nascimento = "1990-03-22",
    id_nivel_acesso = 2,
    id_status_conta = 1
    where id = 2
    ;

#-----------------------------USUARIO----------------------------#


#-----------------------------ADM----------------------------#

update tbl_adm set
	cnpj = "12.345.678/0001-90",
    razao_social = "Oroscorp Industria LTDA",
    id_usuario = 1
    where id = 1
    ;

#-----------------------------ADM----------------------------#


#-----------------------------RESPONSAVEL----------------------------#

update tbl_responsavel set
	cpf = "123.456.789-00",
    id_usuario = 2
    where id = 1
    ;

#-----------------------------RESPONSAVEL----------------------------#


#-----------------------------SETOR----------------------------#

update tbl_setor set
	nome = "Soldagem",
    descricao = "Setor responsavel pela soldagem de estruturas metalicas",
    foto = "setor_soldagem.jpg",
    local = 'Galpão B, piso 2',
    id_status_setor = 1
    where id = 1
    ;

update tbl_setor_responsavel set
	id_setor = 1,
    id_responsavel = 1
    where id = 1
    ;

#-----------------------------SETOR----------------------------#


#-----------------------------FUNCIONARIO----------------------------#

update tbl_funcionario set
	nome = "Joao Souza",
    data_nascimento = "1995-07-10",
    cpf = "987.654.321-00",
    email = "joao.souza@oroscorp.com",
    foto = "joao_souza.jpg",
    id_cargo = 1,
    id_setor = 1,
    id_status_funcionario = 1
    where id = 1
    ;

#-----------------------------FUNCIONARIO----------------------------#


#-----------------------------CAMERA----------------------------#

update tbl_camera set
	nome = "Camera 03",
    descricao = "Camera fixa voltada para a bancada de solda",
    endereco_stream = "rtsp://192.168.0.13:554/stream",
    id_setor = 1,
    id_status_camera = 1
    where id = 1
    ;

#-----------------------------CAMERA----------------------------#


#-----------------------------EPI----------------------------#

update tbl_epi set
	nome = "Capacete",
    descricao = "Capacete de seguranca com viseira",
    qtde = "50",
    foto = "capacete.jpg",
    cor = "Amarelo"
    where id = 1
    ;

update tbl_setor_epi set
	id_setor = 1,
    id_epi = 1
    where id = 1
    ;

#-----------------------------EPI----------------------------#


#-----------------------------OCORRENCIA----------------------------#

update tbl_ocorrencia set
	descricao = "A inteligencia artificial detectou um colaborador operando o posto de solda sem capacete de seguranca.",
    data_hora = "2026-08-28 14:32:18",
    id_setor = 1,
    id_funcionario = 1,
    id_motivo_ocorrencia = 1,
    id_status_ocorrencia = 1,
    id_usuario_registro = null,
    id_usuario_identificacao = 2
    where id = 1
    ;

update tbl_ocorrencia_epi set
	id_ocorrencia = 1,
    id_epi = 1
    where id = 1
    ;

update tbl_ocorrencia_camera set
	id_ocorrencia = 1,
    id_camera = 1,
    foto = "ocorrencia125_cam03.jpg",
    data_hora = "2026-08-28 14:32:18",
    confianca_ia = "94.00"
    where id = 1
    ;

#-----------------------------OCORRENCIA----------------------------#
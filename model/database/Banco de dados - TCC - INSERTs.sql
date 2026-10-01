use db_oroscorp;

#===================================================================
# INSERTS - TABELAS DE DOMINIO
#===================================================================

#Inserindo niveis de acesso
insert into tbl_nivel_acesso (nome) values
('ADM'),
('GESTOR');

#Inserindo status de conta
insert into tbl_status_conta (status) values
('Ativo'),
('Inativo'),
('Bloqueado');

#Inserindo status de funcionario
insert into tbl_status_funcionario (status) values
('Ativo'),
('Inativo'),
('Afastado'),
('Ferias');

#Inserindo status de setor
insert into tbl_status_setor (status) values
('Ativo'),
('Inativo'),
('Em manutencao');

#Inserindo status de ocorrencia
insert into tbl_status_ocorrencia (status) values
('Aberta'),
('Em analise'),
('Resolvida'),
('Cancelada');

#Inserindo motivo de ocorrencia
insert into tbl_motivo_ocorrencia (nome) values
('Ausencia de EPI'),
('Uso incorreto de EPI'),
('Area de risco sem autorizacao');

#Inserindo cargo
insert into tbl_cargo (cargo) values
('Soldador'),
('Operador de maquina'),
('Supervisor de producao');

#Inserindo status de camera
insert into tbl_status_camera (status) values
('Ativa'),
('Inativa');


#===================================================================
# INSERTS - USUARIO, ADM E RESPONSAVEL
#===================================================================

#Inserindo usuario do ADM (dono da empresa)
#senha deve chegar aqui ja com hash (bcrypt/argon2), nunca em texto puro
insert into tbl_usuario (nome, foto, email, senha, data_nascimento, id_nivel_acesso, id_status_conta) values
('Carlos Silva', 'carlos_silva.jpg', 'carlos@oroscorp.com', '$2b$12$hashDeExemplo1', '1980-05-16', 1, 1);

#Inserindo usuario do responsavel
insert into tbl_usuario (nome, foto, email, senha, data_nascimento, id_nivel_acesso, id_status_conta) values
('Ana Pereira', 'ana_pereira.jpg', 'ana@oroscorp.com', '$2b$12$hashDeExemplo2', '1990-03-22', 2, 1);

#Inserindo dados especificos do ADM (usando o id do usuario cadastrado acima)
insert into tbl_adm (cnpj, razao_social, id_usuario) values
('12.345.678/0001-90', 'Oroscorp Industria LTDA', 1);

#Inserindo dados especificos do responsavel
insert into tbl_responsavel (cpf, id_usuario) values
('123.456.789-00', 2);


#===================================================================
# INSERTS - SETOR
#===================================================================

#Inserindo setor (referencia local e status ja cadastrados)
insert into tbl_setor (nome, descricao, foto, local, id_status_setor) values
('Soldagem', 'Setor responsavel pela soldagem de estruturas metalicas', 'setor_soldagem.jpg', 'Galpão A, piso 1', 1);

#Vinculando o setor ao responsavel responsavel
insert into tbl_setor_responsavel (id_setor, id_responsavel) values
(1, 1);


#===================================================================
# INSERTS - FUNCIONARIO
#===================================================================

#Inserindo funcionario (ja vinculado a um setor e cargo fixos)
insert into tbl_funcionario (nome, data_nascimento, cpf, email, foto, id_cargo, id_setor, id_status_funcionario) values
('Joao Souza', '1995-07-10', '987.654.321-00', 'joao.souza@oroscorp.com', 'joao_souza.jpg', 1, 1, 1);


#===================================================================
# INSERTS - CAMERA E EPI
#===================================================================

#Inserindo camera vinculada ao setor
insert into tbl_camera (nome, descricao, endereco_stream, id_setor, id_status_camera) values
('Camera 03', 'Camera fixa voltada para a bancada de solda', 'rtsp://192.168.0.13:554/stream', 1, 1);

#Inserindo EPI
insert into tbl_epi (nome, descricao, qtde, foto, cor) values
('Capacete', 'Capacete de seguranca com viseira', 50, 'capacete.jpg', 'Amarelo');

#Vinculando o EPI como exigido no setor
insert into tbl_setor_epi (id_setor, id_epi) values
(1, 1);


#===================================================================
# INSERTS - OCORRENCIA
#===================================================================

#Inserindo ocorrencia gerada automaticamente pela IA
#id_funcionario, id_usuario_registro e id_usuario_identificacao ficam NULL
#porque a IA nao conseguiu reconhecer o rosto e ninguem registrou manualmente
insert into tbl_ocorrencia (descricao, data_hora, id_setor, id_funcionario, id_motivo_ocorrencia, id_status_ocorrencia, id_usuario_registro, id_usuario_identificacao) values
('A inteligencia artificial detectou um colaborador operando o posto de solda sem capacete de seguranca.', '2026-08-28 14:32:18', 1, null, 1, 1, null, null);

#Inserindo ocorrencia registrada manualmente pelo responsavel
insert into tbl_ocorrencia (descricao, data_hora, id_setor, id_funcionario, id_motivo_ocorrencia, id_status_ocorrencia, id_usuario_registro, id_usuario_identificacao) values
('Responsavel identificou funcionario sem luvas de protecao durante ronda presencial.', '2026-08-29 09:15:00', 1, 1, 1, 1, 2, 2);

#Vinculando o EPI que estava faltando na ocorrencia
insert into tbl_ocorrencia_epi (id_ocorrencia, id_epi) values
(1, 1);

#Vinculando a foto/evidencia da camera na ocorrencia gerada pela IA
insert into tbl_ocorrencia_camera (id_ocorrencia, id_camera, foto, data_hora, confianca_ia) values
(1, 1, 'ocorrencia125_cam03.jpg', '2026-08-28 14:32:18', 94.00);

#Vinculando a foto anexada manualmente na ocorrencia registrada pelo responsavel
#id_camera fica NULL pois a foto foi anexada manualmente, sem camera do sistema
#confianca_ia fica NULL pois nao houve deteccao automatica
insert into tbl_ocorrencia_camera (id_ocorrencia, id_camera, foto, data_hora, confianca_ia) values
(2, null, 'ocorrencia126_manual.jpg', '2026-08-29 09:15:00', null);
#Permite criar um database
create database db_oroscorp;

use db_oroscorp;

#drop database db_oroscorp;

#Permite criar tabelas

#===================================================================
# TABELAS DE DOMINIO (sem dependencia de outras tabelas)
#===================================================================

#Criando tabela de nivel de acesso (ADM, RESPONSAVEL)
create table tbl_nivel_acesso(
	id 		int not null auto_increment primary key,
    nome 	varchar(20) not null
);

#Criando tabela de status da conta (login)
create table tbl_status_conta(
	id 		int not null auto_increment primary key,
    status 	varchar(20) not null
);

#Criando tabela de status do funcionario (vinculo empregaticio)
create table tbl_status_funcionario(
	id 		int not null auto_increment primary key,
    status 	varchar(20) not null
);

#Criando tabela de status do setor
create table tbl_status_setor(
	id 		int not null auto_increment primary key,
    status 	varchar(25) not null
);

#Criando tabela de status da ocorrencia
create table tbl_status_ocorrencia(
	id 		int not null auto_increment primary key,
    status 	varchar(25) not null
);

#Criando tabela de motivo da ocorrencia
create table tbl_motivo_ocorrencia(
	id 		int not null auto_increment primary key,
    nome 	varchar(30) not null
);

#Criando tabela de cargo do funcionario
create table tbl_cargo(
	id 		int not null auto_increment primary key,
    cargo 	varchar(30) not null
);

#Criando tabela de status da camera
create table tbl_status_camera(
	id 		int not null auto_increment primary key,
    status 	varchar(20) not null
);


#===================================================================
# USUARIO, ADM E RESPONSAVEL
#===================================================================

#Criando tabela central de usuario (login do sistema)
create table tbl_usuario(
	id					int not null auto_increment primary key,
    nome 				varchar(100) not null,
    foto 				varchar(256) not null,
    email 				varchar(256) not null unique,
    senha 				varchar(516) not null,
    data_nascimento 	date not null,
    id_nivel_acesso		int not null,
    id_status_conta		int not null,
    
    constraint FK_NIVELACESSO_USUARIO
	foreign key (id_nivel_acesso)
	references tbl_nivel_acesso(id),
    
    constraint FK_STATUSCONTA_USUARIO
	foreign key (id_status_conta)
	references tbl_status_conta(id)
);

#Criando tabela de ADM (dados especificos do dono da empresa)
create table tbl_adm(
	id				int not null auto_increment primary key,
    cnpj 			varchar(20) not null unique,
    razao_social 	varchar(80) not null,
    id_usuario 		int not null unique,
    
    constraint FK_USUARIO_ADM
	foreign key (id_usuario)
	references tbl_usuario(id)
);

#Criando tabela de responsavel (dados especificos do responsavel)
create table tbl_responsavel(
	id			int not null auto_increment primary key,
    cpf 		varchar(15) not null unique,
    id_usuario 	int not null unique,
    
    constraint FK_USUARIO_RESPONSAVEL
	foreign key (id_usuario)
	references tbl_usuario(id)
);


#===================================================================
# SETOR
#===================================================================

#Criando tabela de setor
create table tbl_setor(
	id					int not null auto_increment primary key,
    nome 				varchar(80) not null,
    descricao 			varchar(500) not null,
    foto 				varchar(256) not null,
    local				varchar(80) not null,
    id_status_setor		int not null,
    
    constraint FK_STATUSSETOR_SETOR
	foreign key (id_status_setor)
	references tbl_status_setor(id)
);

#Criando tabela associativa entre setor e responsavel
create table tbl_setor_responsavel(
	id			int not null auto_increment primary key,
    id_setor 	int not null,
    id_responsavel 	int not null,
    
    constraint FK_SETOR_SETORRESPONSAVEL
	foreign key (id_setor)
	references tbl_setor(id),
    
    constraint FK_RESPONSAVEL_SETORRESPONSAVEL
	foreign key (id_responsavel)
	references tbl_responsavel(id)
);


#===================================================================
# FUNCIONARIO
#===================================================================

#Criando tabela de funcionario (nao acessa o sistema, apenas cadastrado)
create table tbl_funcionario(
	id						int not null auto_increment primary key,
    nome 					varchar(80) not null,
    data_nascimento 		date not null,
    cpf 					varchar(15) not null unique,
    email 					varchar(256) not null,
    foto 					varchar(256) not null,
    id_cargo				int not null,
    id_setor				int not null,
    id_status_funcionario	int not null,
    
    constraint FK_CARGO_FUNCIONARIO
	foreign key (id_cargo)
	references tbl_cargo(id),
    
    constraint FK_SETOR_FUNCIONARIO
	foreign key (id_setor)
	references tbl_setor(id),
    
    constraint FK_STATUSFUNCIONARIO_FUNCIONARIO
	foreign key (id_status_funcionario)
	references tbl_status_funcionario(id)
);


#===================================================================
# CAMERA E EPI
#===================================================================

#Criando tabela de camera
create table tbl_camera(
	id					int not null auto_increment primary key,
    nome 				varchar(30) not null,
    descricao 			varchar(500) not null,
    endereco_stream 	varchar(255) not null,
    id_setor 			int not null,
    id_status_camera	int not null,
    
    constraint FK_SETOR_CAMERA
	foreign key (id_setor)
	references tbl_setor(id),
    
    constraint FK_STATUSCAMERA_CAMERA
	foreign key (id_status_camera)
	references tbl_status_camera(id)
);

#Criando tabela de EPI
create table tbl_epi(
	id			int not null auto_increment primary key,
    nome 		varchar(50) not null,
    descricao 	varchar(500) not null,
    qtde 		int not null default 0,
    foto 		varchar(256) not null,
    cor 		varchar(30) not null
);

#Criando tabela associativa entre setor e EPI (EPIs exigidos por setor)
create table tbl_setor_epi(
	id			int not null auto_increment primary key,
    id_setor 	int not null,
    id_epi 		int not null,
    
    constraint FK_SETOR_SETOREPI
	foreign key (id_setor)
	references tbl_setor(id),
    
    constraint FK_EPI_SETOREPI
	foreign key (id_epi)
	references tbl_epi(id)
);


#===================================================================
# OCORRENCIA
#===================================================================

#Criando tabela de ocorrencia
#id_usuario_registro fica NULL quando a ocorrencia for gerada pela IA,
#e preenchido quando for registrada manualmente por um ADM ou responsavel
#id_funcionario fica NULL quando a IA nao conseguir reconhecer o rosto,
#e e preenchido depois, quando um responsavel identificar manualmente quem e
#id_usuario_identificacao guarda quem fez essa identificacao manual do funcionario,
#podendo ser diferente de quem registrou a ocorrencia (id_usuario_registro)
create table tbl_ocorrencia(
	id							int not null auto_increment primary key,
    descricao 					varchar(500) not null,
    data_hora 					datetime not null,
    id_setor					int not null,
    id_funcionario				int null,
    id_motivo_ocorrencia		int not null,
    id_status_ocorrencia		int not null,
    id_usuario_registro			int null,
    id_usuario_identificacao	int null,
    
    constraint FK_SETOR_OCORRENCIA
	foreign key (id_setor)
	references tbl_setor(id),
    
    constraint FK_FUNCIONARIO_OCORRENCIA
	foreign key (id_funcionario)
	references tbl_funcionario(id),
    
    constraint FK_MOTIVOOCORRENCIA_OCORRENCIA
	foreign key (id_motivo_ocorrencia)
	references tbl_motivo_ocorrencia(id),
    
    constraint FK_STATUSOCORRENCIA_OCORRENCIA
	foreign key (id_status_ocorrencia)
	references tbl_status_ocorrencia(id),
    
    constraint FK_USUARIOREGISTRO_OCORRENCIA
	foreign key (id_usuario_registro)
	references tbl_usuario(id),
    
    constraint FK_USUARIOIDENTIFICACAO_OCORRENCIA
	foreign key (id_usuario_identificacao)
	references tbl_usuario(id)
);

#Criando tabela associativa entre ocorrencia e EPI (EPIs faltando na ocorrencia)
create table tbl_ocorrencia_epi(
	id				int not null auto_increment primary key,
    id_ocorrencia 	int not null,
    id_epi 			int not null,
    
    constraint FK_OCORRENCIA_OCORRENCIAEPI
	foreign key (id_ocorrencia)
	references tbl_ocorrencia(id),
    
    constraint FK_EPI_OCORRENCIAEPI
	foreign key (id_epi)
	references tbl_epi(id)
);

#Criando tabela associativa entre ocorrencia e camera (evidencias/fotos)
#id_camera fica NULL quando a foto for anexada manualmente, sem camera do sistema
#confianca_ia fica NULL quando a foto for anexada manualmente (nao ha deteccao de IA)
create table tbl_ocorrencia_camera(
	id				int not null auto_increment primary key,
    id_ocorrencia 	int not null,
    id_camera 		int null,
    foto 			varchar(256) not null,
    data_hora 		datetime not null,
    confianca_ia 	decimal(5,2) null,
    
    constraint FK_OCORRENCIA_OCORRENCIACAMERA
	foreign key (id_ocorrencia)
	references tbl_ocorrencia(id),
    
    constraint FK_CAMERA_OCORRENCIACAMERA
	foreign key (id_camera)
	references tbl_camera(id)
);
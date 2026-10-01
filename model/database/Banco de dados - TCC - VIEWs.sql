use db_oroscorp;

#===================================================================
# VIEW - USUARIO
#===================================================================

#Traz o usuario ja com o nome do nivel de acesso e do status da conta,
#em vez dos ids. Usada no login e em telas de listagem de usuarios.
create view view_usuario_completo as
select tbl_usuario.id,
	   tbl_usuario.nome,
       tbl_usuario.foto,
       tbl_usuario.email,
       tbl_usuario.senha,
       tbl_usuario.data_nascimento,
       tbl_nivel_acesso.nome as nivel_acesso,
       tbl_status_conta.status as status_conta
from tbl_usuario
inner join tbl_nivel_acesso on tbl_nivel_acesso.id = tbl_usuario.id_nivel_acesso
inner join tbl_status_conta on tbl_status_conta.id = tbl_usuario.id_status_conta;


#===================================================================
# VIEW - SETOR
#===================================================================

#Traz o setor ja com o nome do local e do status, em vez dos ids.
#Usada nas telas de listagem e detalhe de setor.
create view view_setor_completo as
select tbl_setor.id,
	   tbl_setor.nome,
       tbl_setor.descricao,
       tbl_setor.foto,
       tbl_setor.local,
       tbl_status_setor.status as status_setor
from tbl_setor
inner join tbl_status_setor on tbl_status_setor.id = tbl_setor.id_status_setor;

#Traz os responsaveis vinculados a cada setor, ja com nome e email do usuario.
#Usada para listar quem administra um setor especifico.
create view view_setor_responsavel as
select tbl_setor_responsavel.id_setor,
	   tbl_setor.nome as setor,
       tbl_responsavel.id as id_responsavel,
       tbl_usuario.nome as responsavel,
       tbl_usuario.email,
       tbl_responsavel.cpf
from tbl_setor_responsavel
inner join tbl_setor on tbl_setor.id = tbl_setor_responsavel.id_setor
inner join tbl_responsavel on tbl_responsavel.id = tbl_setor_responsavel.id_responsavel
inner join tbl_usuario on tbl_usuario.id = tbl_responsavel.id_usuario;


#===================================================================
# VIEW - FUNCIONARIO
#===================================================================

#Traz o funcionario ja com o nome do cargo, setor e status, em vez dos ids.
#Usada na tela de listagem de funcionarios.
create view view_funcionario_completo as
select tbl_funcionario.id,
	   tbl_funcionario.nome,
       tbl_funcionario.data_nascimento,
       tbl_funcionario.cpf,
       tbl_funcionario.email,
       tbl_funcionario.foto,
       tbl_cargo.cargo,
       tbl_setor.nome as setor,
       tbl_status_funcionario.status as status_funcionario
from tbl_funcionario
inner join tbl_cargo on tbl_cargo.id = tbl_funcionario.id_cargo
inner join tbl_setor on tbl_setor.id = tbl_funcionario.id_setor
inner join tbl_status_funcionario on tbl_status_funcionario.id = tbl_funcionario.id_status_funcionario;


#===================================================================
# VIEW - CAMERA
#===================================================================

#Traz a camera ja com o nome do setor e do status, em vez dos ids.
#Usada na tela de listagem de cameras.
create view view_camera_completo as
select tbl_camera.id,
	   tbl_camera.nome,
       tbl_camera.descricao,
       tbl_camera.endereco_stream,
       tbl_setor.nome as setor,
       tbl_status_camera.status as status_camera
from tbl_camera
inner join tbl_setor on tbl_setor.id = tbl_camera.id_setor
inner join tbl_status_camera on tbl_status_camera.id = tbl_camera.id_status_camera;


#===================================================================
# VIEW - OCORRENCIA
#===================================================================

#Traz os dados principais da ocorrencia ja com os nomes (setor, motivo,
#status), em vez dos ids. Usada para montar a tela de detalhes da ocorrencia.
create view view_ocorrencia_detalhe as
select tbl_ocorrencia.id,
	   tbl_ocorrencia.descricao,
       tbl_ocorrencia.data_hora,
       tbl_setor.nome as setor,
       tbl_motivo_ocorrencia.nome as motivo,
       tbl_status_ocorrencia.status as status_ocorrencia,
       coalesce(tbl_funcionario.nome, 'Nao identificado') as funcionario,
       tbl_ocorrencia.id_usuario_registro,
       tbl_ocorrencia.id_usuario_identificacao
from tbl_ocorrencia
inner join tbl_setor on tbl_setor.id = tbl_ocorrencia.id_setor
inner join tbl_motivo_ocorrencia on tbl_motivo_ocorrencia.id = tbl_ocorrencia.id_motivo_ocorrencia
inner join tbl_status_ocorrencia on tbl_status_ocorrencia.id = tbl_ocorrencia.id_status_ocorrencia
left join tbl_funcionario on tbl_funcionario.id = tbl_ocorrencia.id_funcionario;

#Traz todas as fotos/evidencias de cada ocorrencia, ja com o nome da camera,
#ou indicando que foi anexada manualmente. Usada para montar o carrossel.
create view view_ocorrencia_evidencias as
select tbl_ocorrencia_camera.id,
	   tbl_ocorrencia_camera.id_ocorrencia,
       tbl_ocorrencia_camera.foto,
       tbl_ocorrencia_camera.data_hora,
       tbl_ocorrencia_camera.confianca_ia,
       coalesce(tbl_camera.nome, 'Anexada manualmente') as camera
from tbl_ocorrencia_camera
left join tbl_camera on tbl_camera.id = tbl_ocorrencia_camera.id_camera;

#Traz os EPIs que estavam faltando em cada ocorrencia, ja com nome e cor.
create view view_ocorrencia_epis_faltantes as
select tbl_ocorrencia_epi.id_ocorrencia,
	   tbl_epi.nome as epi,
       tbl_epi.cor
from tbl_ocorrencia_epi
inner join tbl_epi on tbl_epi.id = tbl_ocorrencia_epi.id_epi;

#Lista as ocorrencias que ainda nao tiveram o funcionario identificado.
#Usada para montar a fila de identificacao manual.
create view view_ocorrencia_fila_identificacao as
select tbl_ocorrencia.id,
	   tbl_ocorrencia.descricao,
       tbl_ocorrencia.data_hora,
       tbl_setor.nome as setor
from tbl_ocorrencia
inner join tbl_setor on tbl_setor.id = tbl_ocorrencia.id_setor
where tbl_ocorrencia.id_funcionario is null;

#Conta quantas ocorrencias existem por status, para um dashboard geral.
create view view_ocorrencia_por_status as
select tbl_status_ocorrencia.status,
	   count(tbl_ocorrencia.id) as total
from tbl_ocorrencia
inner join tbl_status_ocorrencia on tbl_status_ocorrencia.id = tbl_ocorrencia.id_status_ocorrencia
group by tbl_status_ocorrencia.status;


#===================================================================
# EXEMPLOS DE USO
#===================================================================

#Usando a view no login, filtrando pelo email
select * from view_usuario_completo where email = 'ana@oroscorp.com';

#Usando a view na tela de detalhes de uma ocorrencia especifica
select * from view_ocorrencia_detalhe where id = 1;

#Usando a view do carrossel de fotos de uma ocorrencia especifica
select * from view_ocorrencia_evidencias where id_ocorrencia = 1 order by data_hora;


select * from view_setor_completo;

#Usando a view de ocorrencias visiveis para um responsavel especifico
#(join adicional com tbl_setor_responsavel, que nao faz parte da view)
select view_ocorrencia_detalhe.*
from view_ocorrencia_detalhe
inner join tbl_ocorrencia on tbl_ocorrencia.id = view_ocorrencia_detalhe.id
inner join tbl_setor_responsavel on tbl_setor_responsavel.id_setor = tbl_ocorrencia.id_setor
where tbl_setor_responsavel.id_responsavel = 1;
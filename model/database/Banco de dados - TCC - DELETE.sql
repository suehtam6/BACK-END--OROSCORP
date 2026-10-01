use db_oroscorp;


#===================================================================
# DELETES - OCORRENCIA
#===================================================================

#Apagando uma foto/evidencia especifica de uma ocorrencia
delete from tbl_ocorrencia_camera
where id = 1;

#Apagando todas as fotos/evidencias de uma ocorrencia especifica
delete from tbl_ocorrencia_camera
where id_ocorrencia = 1;

#Apagando o vinculo de um EPI faltante em uma ocorrencia especifica
delete from tbl_ocorrencia_epi
where id = 1;

#Apagando todos os EPIs vinculados a uma ocorrencia especifica
delete from tbl_ocorrencia_epi
where id_ocorrencia = 1;

#Apagando uma ocorrencia
#so funciona se todas as fotos e EPIs vinculados a ela ja tiverem sido apagados antes
delete from tbl_ocorrencia
where id = 1;


#===================================================================
# DELETES - CAMERA E EPI
#===================================================================

#Apagando o vinculo de um EPI exigido em um setor
delete from tbl_setor_epi
where id = 1;

#Apagando um EPI
#so funciona se ele nao estiver vinculado a nenhum setor (tbl_setor_epi)
#nem a nenhuma ocorrencia (tbl_ocorrencia_epi)
delete from tbl_epi
where id = 1;

#Apagando uma camera
#so funciona se ela nao estiver vinculada a nenhuma ocorrencia (tbl_ocorrencia_camera)
delete from tbl_camera
where id = 1;


#===================================================================
# DELETES - FUNCIONARIO
#===================================================================

#Apagando um funcionario
#so funciona se ele nao estiver vinculado a nenhuma ocorrencia (tbl_ocorrencia)
delete from tbl_funcionario
where id = 1;


#===================================================================
# DELETES - SETOR
#===================================================================

#Apagando o vinculo de um responsavel com um setor
delete from tbl_setor_responsavel
where id = 1;

#Apagando um setor
#so funciona se nao houver camera, funcionario, EPI vinculado ou ocorrencia
#registrada para esse setor
delete from tbl_setor
where id = 1;


#===================================================================
# DELETES - USUARIO, ADM E RESPONSAVEL
#===================================================================

#Apagando os dados especificos de um responsavel
#so funciona se ele nao estiver vinculado a nenhum setor (tbl_setor_responsavel)
delete from tbl_responsavel
where id = 1;

#Apagando os dados especificos de um ADM
delete from tbl_adm
where id = 1;

#Apagando um usuario
#so funciona se ele nao tiver registro em tbl_adm ou tbl_responsavel,
#e se nao estiver referenciado em nenhuma ocorrencia
#(id_usuario_registro ou id_usuario_identificacao)
delete from tbl_usuario
where id = 1;


#===================================================================
# DELETES - TABELAS DE DOMINIO
#===================================================================
# So conseguem ser apagadas se nenhum registro estiver usando aquele id

#Apagando um cargo
delete from tbl_cargo
where id = 1;

#Apagando um motivo de ocorrencia
delete from tbl_motivo_ocorrencia
where id = 1;

#Apagando um status de ocorrencia
delete from tbl_status_ocorrencia
where id = 1;

#Apagando um status de camera
delete from tbl_status_camera
where id = 1;

#Apagando um status de setor
delete from tbl_status_setor
where id = 1;

#Apagando um status de funcionario
delete from tbl_status_funcionario
where id = 1;

#Apagando um status de conta
delete from tbl_status_conta
where id = 1;

#Apagando um nivel de acesso
delete from tbl_nivel_acesso
where id = 1;
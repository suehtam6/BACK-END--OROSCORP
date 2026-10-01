use db_oroscorp;

#===================================================================
# SELECTS SIMPLES (uma tabela)
#===================================================================

#Listando todos os usuarios
select * from tbl_usuario;

#Listando todos os setores
select * from tbl_setor;

#Listando todos os funcionarios
select * from tbl_funcionario;

#Listando todas as ocorrencias
select * from tbl_ocorrencia;

#Listando todos os EPIs cadastrados
select * from tbl_epi;

#Listando todas as cameras
select * from tbl_camera;


#===================================================================
# LOGIN
#===================================================================

#Buscando usuario pelo email para conferir a senha no login
#(a comparacao de senha/hash e feita no backend, aqui so trazemos o registro)
select tbl_usuario.id, tbl_usuario.nome, tbl_usuario.email, tbl_usuario.senha,
	   tbl_usuario.id_nivel_acesso, tbl_usuario.id_status_conta
from tbl_usuario
where tbl_usuario.email = 'ana@oroscorp.com';

#Descobrindo se o usuario logado e ADM ou GESTOR, ja trazendo o nome do nivel
select tbl_usuario.id, tbl_usuario.nome, tbl_usuario.email,
	   tbl_nivel_acesso.nome as nivel_acesso,
       tbl_status_conta.status as status_conta
from tbl_usuario
inner join tbl_nivel_acesso on tbl_nivel_acesso.id = tbl_usuario.id_nivel_acesso
inner join tbl_status_conta on tbl_status_conta.id = tbl_usuario.id_status_conta
where tbl_usuario.id = 2;


#===================================================================
# SETOR
#===================================================================

#Listando setores com o nome do status (em vez do id)
select tbl_setor.id, tbl_setor.nome, tbl_setor.descricao, tbl_setor.foto,
	   tbl_setor.local,
       tbl_status_setor.status as status_setor
from tbl_setor
inner join tbl_status_setor on tbl_status_setor.id = tbl_setor.id_status_setor;

#Listando os responsaveis por um setor especifico
select tbl_responsavel.id, tbl_usuario.nome, tbl_usuario.email, tbl_responsavel.cpf
from tbl_setor_responsavel
inner join tbl_responsavel on tbl_responsavel.id = tbl_setor_responsavel.id_responsavel
inner join tbl_usuario on tbl_usuario.id = tbl_responsavel.id_usuario
where tbl_setor_responsavel.id_setor = 1;

#Listando os EPIs exigidos em um setor especifico
select tbl_epi.id, tbl_epi.nome, tbl_epi.cor
from tbl_setor_epi
inner join tbl_epi on tbl_epi.id = tbl_setor_epi.id_epi
where tbl_setor_epi.id_setor = 1;

#Listando ocorrencias visiveis para um responsavel especifico (baseado nos setores dele)
select tbl_ocorrencia.*
from tbl_ocorrencia
inner join tbl_setor_responsavel on tbl_setor_responsavel.id_setor = tbl_ocorrencia.id_setor
where tbl_setor_responsavel.id_responsavel = 1;


#===================================================================
# FUNCIONARIO
#===================================================================

#Listando funcionarios com o nome do cargo, setor e status (em vez dos ids)
select tbl_funcionario.id, tbl_funcionario.nome, tbl_funcionario.cpf, tbl_funcionario.email,
	   tbl_cargo.cargo,
       tbl_setor.nome as setor,
       tbl_status_funcionario.status as status_funcionario
from tbl_funcionario
inner join tbl_cargo on tbl_cargo.id = tbl_funcionario.id_cargo
inner join tbl_setor on tbl_setor.id = tbl_funcionario.id_setor
inner join tbl_status_funcionario on tbl_status_funcionario.id = tbl_funcionario.id_status_funcionario;

#Listando apenas funcionarios ativos de um setor especifico
select tbl_funcionario.id, tbl_funcionario.nome, tbl_funcionario.cpf
from tbl_funcionario
inner join tbl_status_funcionario on tbl_status_funcionario.id = tbl_funcionario.id_status_funcionario
where tbl_funcionario.id_setor = 1
  and tbl_status_funcionario.status = 'Ativo';


#===================================================================
# CAMERA
#===================================================================

#Listando cameras com o nome do setor e do status (em vez dos ids)
select tbl_camera.id, tbl_camera.nome, tbl_camera.descricao, tbl_camera.endereco_stream,
	   tbl_setor.nome as setor,
       tbl_status_camera.status as status_camera
from tbl_camera
inner join tbl_setor on tbl_setor.id = tbl_camera.id_setor
inner join tbl_status_camera on tbl_status_camera.id = tbl_camera.id_status_camera;

#Listando apenas cameras ativas de um setor especifico
select tbl_camera.id, tbl_camera.nome, tbl_camera.endereco_stream
from tbl_camera
inner join tbl_status_camera on tbl_status_camera.id = tbl_camera.id_status_camera
where tbl_camera.id_setor = 1
  and tbl_status_camera.status = 'Ativa';


#===================================================================
# OCORRENCIA (tela de detalhes)
#===================================================================

#Trazendo os dados principais de uma ocorrencia especifica, ja com os nomes
#em vez dos ids (motivo, status, setor), para montar a tela de detalhes
select tbl_ocorrencia.id, tbl_ocorrencia.descricao, tbl_ocorrencia.data_hora,
	   tbl_setor.nome as setor,
       tbl_motivo_ocorrencia.nome as motivo,
       tbl_status_ocorrencia.status as status_ocorrencia,
       tbl_ocorrencia.id_funcionario,
       tbl_ocorrencia.id_usuario_registro,
       tbl_ocorrencia.id_usuario_identificacao
from tbl_ocorrencia
inner join tbl_setor on tbl_setor.id = tbl_ocorrencia.id_setor
inner join tbl_motivo_ocorrencia on tbl_motivo_ocorrencia.id = tbl_ocorrencia.id_motivo_ocorrencia
inner join tbl_status_ocorrencia on tbl_status_ocorrencia.id = tbl_ocorrencia.id_status_ocorrencia
where tbl_ocorrencia.id = 1;

#Trazendo o nome do funcionario da ocorrencia, ou indicando que ainda nao foi identificado
select tbl_ocorrencia.id,
	   coalesce(tbl_funcionario.nome, 'Nao identificado') as funcionario
from tbl_ocorrencia
left join tbl_funcionario on tbl_funcionario.id = tbl_ocorrencia.id_funcionario
where tbl_ocorrencia.id = 1;

#Trazendo os EPIs que estavam faltando em uma ocorrencia especifica
select tbl_epi.nome, tbl_epi.cor
from tbl_ocorrencia_epi
inner join tbl_epi on tbl_epi.id = tbl_ocorrencia_epi.id_epi
where tbl_ocorrencia_epi.id_ocorrencia = 1;

#Trazendo todas as fotos/evidencias de uma ocorrencia, para montar o carrossel
#ja com o nome da camera, ou indicando que foi anexada manualmente
select tbl_ocorrencia_camera.foto, tbl_ocorrencia_camera.data_hora, tbl_ocorrencia_camera.confianca_ia,
	   coalesce(tbl_camera.nome, 'Anexada manualmente') as camera
from tbl_ocorrencia_camera
left join tbl_camera on tbl_camera.id = tbl_ocorrencia_camera.id_camera
where tbl_ocorrencia_camera.id_ocorrencia = 1
order by tbl_ocorrencia_camera.data_hora;

#Listando ocorrencias ainda sem funcionario identificado (fila de identificacao)
select tbl_ocorrencia.id, tbl_ocorrencia.descricao, tbl_ocorrencia.data_hora,
	   tbl_setor.nome as setor
from tbl_ocorrencia
inner join tbl_setor on tbl_setor.id = tbl_ocorrencia.id_setor
where tbl_ocorrencia.id_funcionario is null;

#Contando quantas EPIs existem cadastradas (quantidade em estoque)
select sum(tbl_epi.qtde) as total_epis_cadastradas from tbl_epi;

#Contando ocorrencias por status, para um dashboard geral
select tbl_status_ocorrencia.status, count(tbl_ocorrencia.id) as total
from tbl_ocorrencia
inner join tbl_status_ocorrencia on tbl_status_ocorrencia.id = tbl_ocorrencia.id_status_ocorrencia
group by tbl_status_ocorrencia.status;
console.log("APP.JS VERSÃO TESTE 17:58");

// ================================
// GERENCIADOR DE MODAIS SCRV
// ================================

  
async function carregarPortal(){

  try{

    const dados = await SCRV.API.get("");

    console.log("DADOS DO PORTAL:", dados);
    console.log("DOCUMENTOS RECEBIDOS:", dados.DOCUMENTOS);

    window.todosAvisos = dados.AVISOS || [];
    window.todasNoticias = dados.NOTICIAS || [];

    carregarAvisos(window.todosAvisos, false);
    carregarAniversariantes(dados.ANIVERSARIANTES);
    carregarDestaque(dados.DESTAQUE);
    carregarGaleria(dados.GALERIA);
    carregarNoticias(window.todasNoticias, false);
    carregarDocumentos(dados.DOCUMENTOS);

    document.body.classList.remove("carregando");

  }catch(erro){

    console.error("Erro ao carregar portal:", erro);

  }

}
  
function abrirAreaRh(){

  ModalSCRV.abrir("modalAreaRh");

}

function fecharAreaRh(){

  ModalSCRV.fechar("modalAreaRh");

}
  
  window.abrirDesligadosRh = function(){

    ModalSCRV.abrir("modalDesligadosRh");

};


 document.addEventListener("DOMContentLoaded", async () => {

    await carregarPortal();

    await verificarLoginSalvo();

});

window.abrirNovoFuncionarioRh = function(){

  ModalSCRV.abrir("modalNovoFuncionarioRh");

};
window.fecharModalRh = function(id){

  ModalSCRV.fechar(id);

};


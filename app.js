console.log("APP.JS VERSÃO TESTE 17:58");
const API_URL = "https://script.google.com/macros/s/AKfycbz4aLtDg_OEpJ2PD9fyVGlfmSsjFY8MBiZoCJIgE2i79Qe_XYUY-XBNjFhpSG4gtb8/exec";

// ================================
// GERENCIADOR DE MODAIS SCRV
// ================================
const PilhaModaisSCRV = [];
let modalOrigemRh = "";

// Daqui para baixo começam as funções

  
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
  document.getElementById("modalAreaRh").style.display = "flex";
}

function fecharAreaRh(){
  document.getElementById("modalAreaRh").style.display = "none";
}
  
  window.abrirDesligadosRh = function(){
  const modal = document.getElementById("modalDesligadosRh");
  if(modal){
    modal.style.display = "flex";
  }else{
    alert("Modal Desligados não encontrado.");
  }
};


 carregarPortal();

setTimeout(() => {
  verificarLoginSalvo();
}, 500);


window.abrirNovoFuncionarioRh = function(){

  ModalSCRV.abrir("modalNovoFuncionarioRh");

};
window.fecharModalRh = function(id){

  ModalSCRV.fechar(id);

};


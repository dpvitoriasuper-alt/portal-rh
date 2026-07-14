const TELEFONES_RH_LOJAS = {
  COROADO: "5592982554733",
  CENTRO: "5592981708226",
  SAO_JOSE: "5592982352382",
  TURISMO: "5592988170568",
  TORQUATO: "5592992772611",
  JAPIIM: "5592993454607",
  GRANDE_CIRCULAR: "5592982285909"
};
function abrirModalLojas(){
  document.getElementById("modalLojas").style.display = "flex";
}

function fecharModalLojas(){
  document.getElementById("modalLojas").style.display = "none";
}

function abrirWhatsappLoja(loja){
  const telefone = TELEFONES_RH_LOJAS[loja];

  if(!telefone){
    alert("Telefone da loja não encontrado.");
    return;
  }

  const mensagem = "Olá, RH. Vim pelo Portal do Colaborador.";
  const url = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);

  window.open(url, "_blank");
}
  

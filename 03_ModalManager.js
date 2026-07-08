/**********************************************************************
 * SISTEMA CORPORATIVO REDE VITÓRIA (SCRV)
 * Modal Manager
 **********************************************************************/

const ModalSCRV = (() => {

  let zAtual = 10000;

  function abrir(id){

    const modal = document.getElementById(id);

    if(!modal){
      console.error("Modal não encontrado:", id);
      return;
    }

    zAtual++;

    modal.style.zIndex = zAtual;
    modal.style.display = "flex";

    document.body.classList.add("modal-aberto");

  }

  function fechar(id){

    const modal = document.getElementById(id);

    if(modal){
      modal.style.display = "none";
    }

    if(
      document.querySelectorAll(
        '.modal-rh[style*="display: flex"], .documentos-modal[style*="display: flex"]'
      ).length === 0
    ){
      document.body.classList.remove("modal-aberto");
    }

  }

  function fecharTodos(){

    document
      .querySelectorAll(".modal-rh, .documentos-modal")
      .forEach(m => {

        m.style.display = "none";

      });

    document.body.classList.remove("modal-aberto");

  }

  return {

    abrir,
    fechar,
    fecharTodos

  };

})();

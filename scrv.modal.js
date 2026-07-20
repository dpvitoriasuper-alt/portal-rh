/**
 * =====================================================
 * SCRV.UI
 * Componentes visuais do SCRV
 * =====================================================
 */

SCRV.UI = SCRV.UI || {};

SCRV.UI.Modal = {};
SCRV.UI.Modal.abrir = function(id){

    const modal = document.getElementById(id);

    if(!modal) return;

    modal.style.display = "flex";

    modal.classList.add("scrv-modal-open");

}
SCRV.UI.Modal.fechar = function(id){

    const modal = document.getElementById(id);

    if(!modal) return;

    modal.classList.remove("scrv-modal-open");

    setTimeout(()=>{

        modal.style.display="none";

    },180);

}


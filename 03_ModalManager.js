/**********************************************************************
 * SISTEMA CORPORATIVO REDE VITÓRIA (SCRV)
 * Modal Manager v2
 **********************************************************************/

function atualizarBody(){

    if(modaisAbertos > 0){

        document.body.classList.add("modal-aberto");
        document.body.style.overflow = "hidden";

    }else{

        document.body.classList.remove("modal-aberto");
        document.body.style.overflow = "";

        document.documentElement.style.overflow = "";

    }

}

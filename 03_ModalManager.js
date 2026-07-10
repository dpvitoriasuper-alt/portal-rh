/**********************************************************************
 * SISTEMA CORPORATIVO REDE VITÓRIA (SCRV)
 * Modal Manager v2
 **********************************************************************/

function atualizarBody() {

    const existeModalAberto = Array.from(
        document.querySelectorAll(".modal-rh, .documentos-modal")
    ).some(modal => {

        const estilo = window.getComputedStyle(modal);

        return (
            estilo.display !== "none" &&
            estilo.visibility !== "hidden" &&
            parseFloat(estilo.opacity) > 0
        );

    });

    if (existeModalAberto) {

        document.body.classList.add("modal-aberto");
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

    } else {

        document.body.classList.remove("modal-aberto");
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        // Sincroniza o contador caso alguém tenha aberto/fechado modal
        // diretamente com style.display
        modaisAbertos = 0;

    }

}

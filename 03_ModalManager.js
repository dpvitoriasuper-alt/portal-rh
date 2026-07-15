/**********************************************************************
 * SISTEMA CORPORATIVO REDE VITÓRIA (SCRV)
 * Modal Manager
 **********************************************************************/
const PilhaModaisSCRV = [];
let modalOrigemRh = "";

const ModalSCRV = (() => {

    let zAtual = 10000;
    let modaisAbertos = 0;

    function atualizarBody() {

        if (modaisAbertos > 0) {

            document.body.classList.add("modal-aberto");
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";

        } else {

            document.body.classList.remove("modal-aberto");
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";

        }

    }

    function abrir(id) {

        const modal = document.getElementById(id);

        if (!modal) {
            console.error("Modal não encontrado:", id);
            return;
        }

        if (modal.style.display !== "flex") {
            modaisAbertos++;
        }

        zAtual++;

        modal.style.display = "flex";
        modal.style.zIndex = zAtual;

        atualizarBody();

    }

    function fechar(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        if (modal.style.display === "flex") {

            modal.style.display = "none";

            modaisAbertos--;

            if (modaisAbertos < 0) {
                modaisAbertos = 0;
            }

        }

        atualizarBody();

    }

    function fecharTodos() {

        document
            .querySelectorAll(".modal-rh, .documentos-modal")
            .forEach(modal => {

                modal.style.display = "none";

            });

        modaisAbertos = 0;

        atualizarBody();

    }

    function quantidade() {

        return modaisAbertos;

    }

    return {

        abrir,
        fechar,
        fecharTodos,
        quantidade

    };

})();

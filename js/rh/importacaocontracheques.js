window.abrirImportarContrachequesRh = function () {

    document.getElementById("modalImportarContrachequesRh").style.display = "flex";

};

window.fecharImportacaoContrachequesRh = function () {

    document.getElementById("modalImportarContrachequesRh").style.display = "none";

};

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("arquivoContrachequesRh");

    if (!input) return;

    input.addEventListener("change", function () {

        const nome = document.getElementById("nomeArquivoContracheques");

        if (this.files.length) {

            nome.innerHTML = "📄 " + this.files[0].name;

        } else {

            nome.innerHTML = "Nenhum arquivo selecionado.";

        }

    });

});

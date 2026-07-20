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
async function enviarArquivoContrachequesRh() {

    const arquivo = document.getElementById("arquivoContrachequesRh").files[0];
    const status = document.getElementById("statusImportacaoContracheques");

    if (!arquivo) {
        status.innerHTML = "Selecione um arquivo.";
        return;
    }

    status.innerHTML = "Preparando arquivo...";

    const leitor = new FileReader();

    leitor.onload = async function () {

        const base64 = leitor.result.split(",")[1];

        status.innerHTML = "Enviando...";

        try {

            const resposta = await fetch(API_URL, {

                method: "POST",

                body: JSON.stringify({

                    action: "uploadImportacaoContracheques",

                    nomeArquivo: arquivo.name,

                    tipoArquivo: arquivo.type,

                    arquivoBase64: base64

                })

            });

            const dados = await resposta.json();

console.log("RESPOSTA:", dados);

status.innerHTML = "✅ " + dados.mensagem;

        } catch (erro) {

            console.error(erro);

            status.innerHTML = "Erro ao enviar arquivo.";

        }

    };

    leitor.readAsDataURL(arquivo);

}

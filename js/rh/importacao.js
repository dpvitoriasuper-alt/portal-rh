window.abrirImportarDominioRh = function () {

    const modal = document.getElementById("modalImportarDominioRh");

    if (!modal) {
        alert("Modal modalImportarDominioRh não encontrado.");
        return;
    }

    modal.style.display = "flex";

    const input = document.getElementById("arquivoDominioRh");

    if (input && !input.dataset.evento) {

        input.dataset.evento = "ok";

        input.addEventListener("change", function () {

            if (this.files.length === 0) return;

            document.getElementById("nomeArquivoDominio").innerHTML =
                "📄 " + this.files[0].name;

        });

    }

};

async function enviarArquivoDominioRh() {

    const arquivo = document.getElementById("arquivoDominioRh").files[0];
    const status = document.getElementById("statusImportacaoDominio");

    if (!arquivo) {
        status.innerHTML = "Selecione um arquivo.";
        return;
    }

    status.innerHTML = "⏳ Preparando arquivo...";

    try {

        const base64 = await converterArquivoParaBase64Rh(arquivo);

        status.innerHTML = "⏳ Enviando arquivo...";

        const payload = {
    action: "uploadImportacaoDominio",
    nomeArquivo: arquivo.name,
    arquivoBase64: base64
};

const resposta = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
});
        const dados = await resposta.json();

        if (dados.sucesso) {
            status.innerHTML = "✅ " + dados.mensagem;
        } else {
            status.innerHTML = "❌ " + dados.mensagem;
        }

    } catch (e) {

        console.error(e);
        status.innerHTML = "❌ " + e.toString();

    }

}
function limparImportacaoDominioRh(){

    const arquivo = document.getElementById("arquivoDominioRh");
    const nome = document.getElementById("nomeArquivoDominio");
    const status = document.getElementById("statusImportacaoDominio");
    const resultado = document.getElementById("resultadoImportacaoDominio");

    if(arquivo) arquivo.value = "";

    if(nome){
        nome.innerHTML = "Nenhum arquivo selecionado.";
    }

    if(status){
        status.innerHTML = "";
    }

    if(resultado){
        resultado.innerHTML = "";
    }

}

function fecharImportacaoDominioRh(){

    limparImportacaoDominioRh();

    fecharModalRh("modalImportarDominioRh");

}


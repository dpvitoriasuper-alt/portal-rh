/**********************************************************************
 * SCRV
 * RH - Cadastro Completo
 **********************************************************************/

window.formatarDataHoraRh = function (valor) {

    if (!valor) return "-";

    const data = new Date(valor);

    if (isNaN(data.getTime())) {
        return valor;
    }

    return data.toLocaleString("pt-BR", {
        timeZone: "America/Manaus",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

};

window.formatarMoedaRh = function (valor) {

    if (!valor) return "-";

    let numero = String(valor)
        .replace(/\./g, "")
        .replace(",", ".");

    numero = parseFloat(numero);

    if (isNaN(numero)) return valor;

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

};

window.trocarAbaRh = function (nome) {

    document
        .querySelectorAll(".rh-aba")
        .forEach(el => el.classList.remove("ativa"));

    document
        .querySelectorAll(".rh-conteudo-aba")
        .forEach(el => el.classList.remove("ativa"));

    document
        .getElementById("abaBtn_" + nome)
        ?.classList.add("ativa");

    document
        .getElementById("aba_" + nome)
        ?.classList.add("ativa");

};

window.fecharCadastroCompletoRh = function () {

    ModalSCRV.fechar("modalCadastroCompletoRh");

    if (window.modalOrigemRh) {

        ModalSCRV.abrir(window.modalOrigemRh);

        window.modalOrigemRh = "";

    }

};

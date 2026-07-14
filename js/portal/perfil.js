function preencherPerfilColaborador(dados){

  document.getElementById("areaColaborador").style.display = "grid";

  document.getElementById("saudacaoColaborador").innerText =
    "Olá, " + (dados.nome || "colaborador") + "!";

  let ultimoAcesso = dados.ultimoAcesso || "Este é seu primeiro acesso.";

  if(ultimoAcesso !== "Este é seu primeiro acesso."){
    const dataConvertida = new Date(ultimoAcesso);

    if(!isNaN(dataConvertida.getTime())){
      ultimoAcesso = dataConvertida.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Manaus"
      }).replace(",", " às");
    }
  }

  document.getElementById("ultimoAcessoTexto").innerText =
    "Seu último acesso foi: " + ultimoAcesso;

  document.getElementById("perfilNome").innerText = dados.nome || "-";
  document.getElementById("perfilCpf").innerText = dados.cpf || "-";
  document.getElementById("perfilMatricula").innerText = dados.matricula || "-";
  document.getElementById("perfilFuncao").innerText = dados.funcao || "-";
  document.getElementById("perfilAdmissao").innerText = dados.admissao || "-";
}


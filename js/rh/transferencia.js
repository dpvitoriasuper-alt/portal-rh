async function abrirTransferenciaLojaRh(){

  const lojaAtual =
    document.querySelector("#aba_contrato .perfil-item span")?.innerText || "";

  document.getElementById("lojaAtualTransferenciaRh").value = lojaAtual;
  document.getElementById("justificativaTransferenciaRh").value = "";
  document.getElementById("mensagemTransferenciaRh").innerText = "";

  document.getElementById("modalTransferenciaLojaRh").style.display = "flex";

  await carregarLojasTransferenciaRh(lojaAtual);
}
function fecharTransferenciaLojaRh(){
  document.getElementById("modalTransferenciaLojaRh").style.display = "none";
}

async function salvarTransferenciaLojaRh(){

  const lojaAtual =
    document.getElementById("lojaAtualTransferenciaRh").value;

  const novaLoja =
    document.getElementById("novaLojaTransferenciaRh").value;

  const justificativa =
    document.getElementById("justificativaTransferenciaRh").value;

  const msg =
    document.getElementById("mensagemTransferenciaRh");

  if(!novaLoja){
    msg.innerText = "Selecione a nova loja.";
    return;
  }

  if(!justificativa){
    msg.innerText = "Informe a justificativa da transferência.";
    return;
  }

  const sessao =
    JSON.parse(localStorage.getItem("portalLogin"));

  const usuario =
    sessao?.dados?.nome || "USUARIO";

  msg.innerText = "Realizando transferência...";

  const url =
    API_URL +
    "?action=transferirLojaRh" +
    "&cpf=" + encodeURIComponent(cpfCadastroAtual) +
    "&novaLoja=" + encodeURIComponent(novaLoja) +
    "&justificativa=" + encodeURIComponent(justificativa) +
    "&usuario=" + encodeURIComponent(usuario) +
    "&v=" + new Date().getTime();

  try{

    const resposta = await fetch(url, { cache:"no-store" });
    const dados = await resposta.json();

    if(!dados.sucesso){
      msg.innerText = dados.mensagem || "Erro ao transferir.";
      return;
    }

    msg.innerText = "Transferência realizada com sucesso.";

    setTimeout(() => {
      fecharTransferenciaLojaRh();
      abrirCadastroCompletoRh(cpfCadastroAtual);
    }, 1200);

  }catch(erro){
    console.error("Erro ao transferir loja:", erro);
    msg.innerText = "Erro ao realizar transferência.";
  }
}
  async function carregarLojasTransferenciaRh(lojaAtual){

  const select = document.getElementById("novaLojaTransferenciaRh");

  select.innerHTML = `
    <option value="">Carregando lojas...</option>
  `;

  const url =
    API_URL +
    "?action=buscarLojasCadastroRh" +
    "&v=" + new Date().getTime();

  try{

    const resposta = await fetch(url, { cache:"no-store" });
    const dados = await resposta.json();

    if(!dados.sucesso){
      select.innerHTML = `
        <option value="">Erro ao carregar lojas</option>
      `;
      return;
    }

    select.innerHTML = `
      <option value="">Selecione...</option>
    `;

    dados.lojas.forEach(loja => {

      if(String(loja).trim().toUpperCase() === String(lojaAtual).trim().toUpperCase()){
        return;
      }

      select.innerHTML += `
        <option value="${loja}">${loja}</option>
      `;

    });

  }catch(erro){

    console.error("Erro ao carregar lojas:", erro);

    select.innerHTML = `
      <option value="">Erro ao carregar lojas</option>
    `;
  }
}

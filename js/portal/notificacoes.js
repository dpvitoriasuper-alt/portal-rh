function carregarNotificacoesColaborador(lista){

  notificacoesAtuais = lista || [];

  const badge = document.getElementById("badgeNotificacao");
  const resumo = document.getElementById("resumoNotificacoes");
  const container = document.getElementById("listaNotificacoes");

  container.innerHTML = "";

  if(notificacoesAtuais.length === 0){
    badge.style.display = "none";
    resumo.innerText = "Nenhuma notificação nova.";
    return;
  }

  badge.style.display = "block";
  badge.innerText = notificacoesAtuais.length;

  resumo.innerText =
    notificacoesAtuais.length === 1
      ? "Você tem 1 notificação nova."
      : "Você tem " + notificacoesAtuais.length + " notificações novas.";

  notificacoesAtuais.forEach(notificacao => {
    container.innerHTML += `
      <div class="notificacao-mini">
        <strong>${notificacao.titulo || "Notificação"}</strong>
        <span>${notificacao.mensagem || ""}</span>
      </div>
    `;
  });

  abrirNotificacao(notificacoesAtuais[0]);
}

function abrirNotificacao(notificacao){

  if(!notificacao) return;

  notificacaoAtual = notificacao;

  document.getElementById("notificacaoTitulo").innerText =
    "📢 " + (notificacao.titulo || "Notificação");

  document.getElementById("notificacaoMensagem").innerText =
    notificacao.mensagem || "";

  document.getElementById("notificacaoModal").style.display = "flex";
}

function fecharNotificacaoAtual(){
  document.getElementById("notificacaoModal").style.display = "none";
}

async function limparNotificacaoAtual(){

  if(!notificacaoAtual){
    fecharNotificacaoAtual();
    return;
  }

  try{
    const url =
      API_URL +
      "?action=limparNotificacao" +
      "&cpf=" + encodeURIComponent(String(cpfLogado || document.getElementById("perfilCpf").innerText || "").replace(/\D/g, "")) +
      "&idNotificacao=" + encodeURIComponent(notificacaoAtual.id);

    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log("LIMPAR NOTIFICAÇÃO:", dados);

    notificacoesAtuais = notificacoesAtuais.filter(item => item.id !== notificacaoAtual.id);

    fecharNotificacaoAtual();
    carregarNotificacoesColaborador(notificacoesAtuais);

  }catch(erro){
    console.error("ERRO AO LIMPAR NOTIFICAÇÃO:", erro);
    fecharNotificacaoAtual();
  }
}


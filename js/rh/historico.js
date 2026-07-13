function abrirNovaOcorrenciaRh(){
  document.getElementById("descricaoOcorrenciaRh").value = "";
  document.getElementById("mensagemOcorrenciaRh").innerText = "";
  document.getElementById("modalNovaOcorrenciaRh").style.display = "flex";
}

function fecharNovaOcorrenciaRh(){
  document.getElementById("modalNovaOcorrenciaRh").style.display = "none";
}

async function salvarOcorrenciaRh(){

  const tipo = document.getElementById("tipoOcorrenciaRh").value;
  const descricao = document.getElementById("descricaoOcorrenciaRh").value;
  const msg = document.getElementById("mensagemOcorrenciaRh");

  if(!descricao){
    msg.innerText = "Informe a descrição/justificativa.";
    return;
  }

  const sessao = JSON.parse(localStorage.getItem("portalLogin"));
  const usuario = sessao?.dados?.nome || "USUARIO";

  msg.innerText = "Salvando ocorrência...";

  const url =
    API_URL +
    "?action=salvarOcorrenciaFuncionarioRh" +
    "&cpf=" + encodeURIComponent(cpfCadastroAtual) +
    "&nome=" + encodeURIComponent(nomeFuncionarioAtual) +
    "&tipo=" + encodeURIComponent(tipo) +
    "&descricao=" + encodeURIComponent(descricao) +
    "&usuario=" + encodeURIComponent(usuario) +
    "&v=" + new Date().getTime();

  try{

    const resposta = await fetch(url, { cache: "no-store" });
    const dados = await resposta.json();

    if(!dados.sucesso){
      msg.innerText = dados.mensagem || "Erro ao salvar ocorrência.";
      return;
    }

    msg.innerText = "Ocorrência registrada com sucesso.";

    setTimeout(() => {
      fecharNovaOcorrenciaRh();
      carregarHistoricoRh();
    }, 1000);

  }catch(erro){
    console.error(erro);
    msg.innerText = "Erro ao registrar ocorrência.";
  }
}
 async function carregarHistoricoRh(){

  const lista = document.getElementById("listaHistoricoRh");

  lista.innerHTML = `
    <div class="rh-vazio">
      Carregando histórico...
    </div>
  `;

  const url =
    API_URL +
    "?action=buscarHistoricoFuncionarioRh" +
    "&cpf=" + encodeURIComponent(cpfCadastroAtual) +
    "&v=" + Date.now();

  try{

    const resposta = await fetch(url,{ cache:"no-store" });
    const dados = await resposta.json();

    if(!dados.sucesso){
      lista.innerHTML = dados.mensagem || "Erro ao carregar histórico.";
      return;
    }

    if(!dados.historico || dados.historico.length === 0){
      lista.innerHTML = `
        <div class="rh-vazio">
          Nenhum histórico registrado para este colaborador.
        </div>
      `;
      return;
    }

    let html = "";

    dados.historico.forEach(item => {

      html += `
        <div class="rh-card-info" style="margin-bottom:15px;">

          <strong>📌 ${item.tipo || "OCORRÊNCIA"}</strong>

          <div style="margin-top:12px;line-height:1.8;color:#fff;">

            <div>
              📅 <b>Data:</b>
              ${formatarDataHoraRh(item.data)}
            </div>

            ${
              item.lojaAnterior
              ? `<div>🏬 <b>Loja anterior:</b> ${item.lojaAnterior}</div>`
              : ""
            }

            ${
              item.novaLoja
              ? `<div>🏬 <b>Nova loja:</b> ${item.novaLoja}</div>`
              : ""
            }

            ${
              item.tempoLojaAnterior
              ? `<div>⏳ <b>Tempo na loja anterior:</b> ${item.tempoLojaAnterior}</div>`
              : ""
            }

            <div>
              📝 <b>Justificativa:</b>
              ${item.justificativa || "-"}
            </div>

            <div>
              👤 <b>Usuário:</b>
              ${item.usuario || "-"}
            </div>

          </div>

        </div>
      `;

    });

    lista.innerHTML = html;

  }catch(erro){

    console.error(erro);

    lista.innerHTML = "Erro ao carregar histórico.";

  }

}

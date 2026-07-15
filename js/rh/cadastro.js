/**********************************************************************
 * SCRV
 * RH - Cadastro Completo
 **********************************************************************/

function formatarDataHoraRh(valor){

    if(!valor) return "-";

    const data = new Date(valor);

    if(isNaN(data.getTime())){
        return valor;
    }

    return data.toLocaleString("pt-BR",{
        timeZone: "America/Manaus",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

}

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
 window.salvarNovoFuncionarioRh = async function(){

  const msg = document.getElementById("mensagemNovoFuncionarioRh");

  const dados = {
    nome: document.getElementById("novoNomeRh").value,
    cpf: document.getElementById("novoCpfRh").value,
    rg: document.getElementById("novoRgRh").value,
    pis: document.getElementById("novoPisRh").value,
    nascimento: document.getElementById("novoNascimentoRh").value,
    mae: document.getElementById("novoMaeRh").value,
    pai: document.getElementById("novoPaiRh").value,
    endereco: document.getElementById("novoEnderecoRh").value,
    numero: document.getElementById("novoNumeroRh").value,
    bairro: document.getElementById("novoBairroRh").value,
    cep: document.getElementById("novoCepRh").value,
    cidade: document.getElementById("novoCidadeRh").value,
    uf: document.getElementById("novoUfRh").value,
    telefone: document.getElementById("novoTelefoneRh").value,
    email: document.getElementById("novoEmailRh").value,
    loja: document.getElementById("novoLojaRh").value,
    cnpj: document.getElementById("novoCnpjRh").value,
    matricula: document.getElementById("novoMatriculaRh").value,
    funcao: document.getElementById("novoFuncaoRh").value,
    departamento: document.getElementById("novoDepartamentoRh").value,
    salario: document.getElementById("novoSalarioRh").value,
    admissao: document.getElementById("novoAdmissaoRh").value,
    contrato1: document.getElementById("novoContrato1Rh").value,
    contrato2: document.getElementById("novoContrato2Rh").value
  };

  if(!dados.nome || !dados.cpf || !dados.loja || !dados.funcao || !dados.admissao){
    msg.innerText = "Preencha pelo menos Nome, CPF, Loja, Função e Data de Admissão.";
    return;
  }

  msg.innerText = "Salvando funcionário...";

  const url =
    API_URL +
    "?action=salvarNovoFuncionarioRh" +
    "&dados=" + encodeURIComponent(JSON.stringify(dados)) +
    "&v=" + new Date().getTime();

  try{
    const resposta = await fetch(url, { cache:"no-store" });
    const retorno = await resposta.json();

    if(!retorno.sucesso){
      msg.innerText = retorno.mensagem || "Erro ao salvar funcionário.";
      return;
    }

    msg.innerText = "Funcionário salvo com sucesso.";

  }catch(erro){
    console.error(erro);
    msg.innerText = "Erro ao salvar funcionário.";
  }
};

async function abrirCadastroCompletoRh(cpf){

   modalOrigemRh = "";

// Funcionários
if(document.getElementById("modalFuncionariosRh")?.style.display === "flex"){
    modalOrigemRh = "modalFuncionariosRh";
   ModalSCRV.fechar("modalFuncionariosRh");
}

// Experiência
if(document.getElementById("modalExperienciaRh")?.style.display === "flex"){
    modalOrigemRh = "modalExperienciaRh";
    ModalSCRV.fechar("modalExperienciaRh");
}

// Desligados
if(document.getElementById("modalDesligadosRh")?.style.display === "flex"){
    modalOrigemRh = "modalDesligadosRh";
    ModalSCRV.fechar("modalDesligadosRh");
}

// Importação
if(document.getElementById("modalImportarDominioRh")?.style.display === "flex"){
    modalOrigemRh = "modalImportarDominioRh";
    ModalSCRV.fechar("modalImportarDominioRh");
}

// Abre o cadastro
ModalSCRV.abrir("modalCadastroCompletoRh");
  const modal = document.getElementById("modalCadastroCompletoRh");

  const conteudo = document.getElementById("conteudoCadastroCompletoRh");

  conteudo.innerHTML = `
    <div class="rh-card-info">
      <strong>Carregando cadastro...</strong>
      <span>CPF: ${cpf}</span>
    </div>
  `;

  const sessao = JSON.parse(localStorage.getItem("portalLogin"));
  const cpfUsuario = sessao.dados.cpf;

  const url =
    API_URL +
    "?action=portalRhBuscarCadastroCompleto" +
    "&cpfFuncionario=" + encodeURIComponent(cpf) +
    "&cpfUsuario=" + encodeURIComponent(cpfUsuario) +
    "&v=" + new Date().getTime();

  const resposta = await fetch(url, { cache: "no-store" });
  const dados = await resposta.json();

   console.log("CADASTRO COMPLETO:", dados);
   
  if(!dados.sucesso){
    conteudo.innerHTML = `
      <div class="rh-card-info">
        <strong>Erro</strong>
        <span>${dados.mensagem || "Não foi possível carregar o cadastro."}</span>
      </div>
    `;
    return;
  }

  const c = dados.cadastro;

console.log(c);
   
   window.cpfCadastroAtual = c.CPF || "";
window.nomeFuncionarioAtual = c.NOME || "";
   
  conteudo.innerHTML = `

    <div class="rh-card-info">
      <strong>${c.NOME || "-"}</strong>
      <span>
        CPF: ${c.CPF || "-"} |
        Matrícula: ${c["MATRICULA ESOCIAL"] || "-"}
      </span>
    </div>

    <div class="rh-abas">

      <button
        id="abaBtn_pessoal"
        class="rh-aba ativa"
        onclick="trocarAbaRh('pessoal')">
        👤 Dados Pessoais
      </button>

      <button
        id="abaBtn_contrato"
        class="rh-aba"
        onclick="trocarAbaRh('contrato')">
        🏢 Dados Contratuais
      </button>

<button
  id="abaBtn_documentos"
  class="rh-aba"
  onclick="trocarAbaRh('documentos'); carregarQuantidadesDocumentosRh();">
  📁 Documentos
</button>

<button
  id="abaBtn_historico"
  class="rh-aba"
  onclick="trocarAbaRh('historico'); carregarHistoricoRh();">
  📝 Histórico
</button>

    </div>

    <div id="aba_pessoal" class="rh-conteudo-aba ativa">

      <div class="perfil-grid">

        <div class="perfil-item"><small>RG</small><span>${c.RG || "-"}</span></div>
        <div class="perfil-item"><small>PIS</small><span>${c.PIS || "-"}</span></div>
        <div class="perfil-item"><small>Data Nascimento</small><span>${c.DATA_NASCIMENTO || "-"}</span></div>
        <div class="perfil-item"><small>Nome da Mãe</small><span>${c.NOME_MAE || "-"}</span></div>
        <div class="perfil-item"><small>Nome do Pai</small><span>${c.NOME_PAI || "-"}</span></div>
        <div class="perfil-item"><small>Telefone</small><span>${c.TELEFONE || "-"}</span></div>
        <div class="perfil-item"><small>E-mail</small><span>${c.EMAIL || "-"}</span></div>
        <div class="perfil-item"><small>Endereço</small><span>${c.ENDERECO || "-"} ${c.NUMERO || ""}</span></div>
        <div class="perfil-item"><small>Bairro</small><span>${c.BAIRRO || "-"}</span></div>
        <div class="perfil-item"><small>CEP</small><span>${c.CEP || "-"}</span></div>
        <div class="perfil-item"><small>Cidade / UF</small><span>${c.CIDADE || "-"} / ${c.UF || "-"}</span></div>

      </div>

    </div>

    <div id="aba_contrato" class="rh-conteudo-aba">

      <div class="perfil-grid">

        <div class="perfil-item"><small>Loja</small><span>${c.LOJA || "-"}</span></div>
        <div class="perfil-item"><small>CNPJ</small><span>${c.CNPJ || "-"}</span></div>
        <div class="perfil-item"><small>Função</small><span>${c.FUNCAO || "-"}</span></div>
        <div class="perfil-item"><small>Departamento</small><span>${c.DEPARTAMENTO || "-"}</span></div>
        <div class="perfil-item"><small>Salário</small><span>${formatarMoedaRh(c.SALARIO)}</span></div>
        <div class="perfil-item"><small>Admissão</small><span>${c.DATA_ADMISSAO || "-"}</span></div>
        <div class="perfil-item"><small>1º Contrato</small><span>${c.VENCIMENTO_1_CONTRATO || "-"}</span></div>
        <div class="perfil-item"><small>2º Contrato</small><span>${c.VENCIMENTO_2_CONTRATO || "-"}</span></div>
        <div class="perfil-item"><small>Status</small><span>${c.STATUS || "ATIVO"}</span></div>

      </div>

      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">

        <button
  class="rh-btn-acao"
  onclick="abrirTransferenciaLojaRh()">
  🔄 Transferir Loja
</button>

      </div>

    </div>
<div id="aba_documentos" class="rh-conteudo-aba">

  <div class="rh-card-info">
    <strong>📁 Documentos do Funcionário</strong>
    <span>
      Todos os documentos serão armazenados na pasta individual do colaborador.
    </span>
  </div>

  <div class="rh-tabela-box">

    <table class="rh-tabela">

      <thead>
        <tr>
          <th>Categoria</th>
          <th>Arquivos</th>
          <th>Ação</th>
        </tr>
      </thead>

      <tbody>

       <tr>
  <td>📄 Documentos Pessoais</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📄 Documentos Pessoais')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📋 Ficha de Registro</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📋 Ficha de Registro')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📝 Contrato</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📝 Contrato')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>🦺 Cautelas de EPI</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('🦺 Cautelas de EPI')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>🩺 ASO</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('🩺 ASO')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>🏥 Atestado</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('🏥 Atestado')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>🎉 Férias</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('🎉 Férias')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📄 Contracheques</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📄 Contracheques')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>🧾 Recibos Eletrônicos</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('🧾 Recibos Eletrônicos')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>⚠️ Advertência e Suspensão</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('⚠️ Advertência e Suspensão')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>🛌 Afastamento</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('🛌 Afastamento')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📑 Termos</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📑 Termos')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>⏰ Ponto</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('⏰ Ponto')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>⌛ Banco de Horas</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('⌛ Banco de Horas')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📕 Doc Rescisório</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📕 Doc Rescisório')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📄 Recibos de Pagamento</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📄 Recibos de Pagamento')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>👶 Pensão Alimentícia</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('👶 Pensão Alimentícia')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📷 Foto do Funcionário</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📷 Foto do Funcionário')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📮 Cartas de Cancelamento</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📮 Cartas de Cancelamento')">
      Abrir
    </button>
  </td>
</tr>

<tr>
  <td>📎 Outros</td>
  <td>0</td>
  <td>
    <button onclick="abrirCategoriaDocumentoRh('📎 Outros')">
      Abrir
    </button>
  </td>
</tr>
      </tbody>

    </table>

  </div>

</div>
<div id="aba_historico" class="rh-conteudo-aba">

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">

    <h3 style="margin:0;">
      📝 Histórico Geral do Colaborador
    </h3>

    <button onclick="abrirNovaOcorrenciaRh()">
      ➕ Nova Ocorrência
    </button>

  </div>

  <div id="listaHistoricoRh">
    <div class="rh-vazio">
      Carregando histórico...
    </div>
  </div>

</div>

  `;
}

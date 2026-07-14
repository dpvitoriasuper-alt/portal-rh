console.log("APP.JS VERSÃO TESTE 17:58");
const API_URL = "https://script.google.com/macros/s/AKfycbz4aLtDg_OEpJ2PD9fyVGlfmSsjFY8MBiZoCJIgE2i79Qe_XYUY-XBNjFhpSG4gtb8/exec";

// ================================
// GERENCIADOR DE MODAIS SCRV
// ================================
const PilhaModaisSCRV = [];
let modalOrigemRh = "";

// Daqui para baixo começam as funções

function carregarDocumentos(lista){

  const container = document.getElementById("documentosGrid");

  if(!container) return;
  

  container.innerHTML = "";

  if(!lista || lista.length === 0){
    container.innerHTML = "<p>Nenhum documento cadastrado.</p>";
    return;
  }

  lista
    .filter(item => String(item.ATIVO || "").trim().toUpperCase() === "SIM")
    .sort((a,b) => Number(a.ORDEM || 0) - Number(b.ORDEM || 0))
    .forEach(item=>{

      container.innerHTML += `
        <a class="documento-card"
           href="${item.LINK || "#"}"
           target="_blank">

          <h3>📄 ${item.TITULO || ""}</h3>
          <p>${item.DESCRICAO || ""}</p>

        </a>
      `;

    });

}
  
async function carregarPortal(){

  try{

    const resposta = await fetch(API_URL + "?v=" + new Date().getTime());
    const dados = await resposta.json();

    console.log("DADOS DO PORTAL:", dados);
    console.log("DOCUMENTOS RECEBIDOS:", dados.DOCUMENTOS);

    window.todosAvisos = dados.AVISOS || [];
    window.todasNoticias = dados.NOTICIAS || [];

    carregarAvisos(window.todosAvisos, false);
    carregarAniversariantes(dados.ANIVERSARIANTES);
    carregarDestaque(dados.DESTAQUE);
    carregarGaleria(dados.GALERIA);
    carregarNoticias(window.todasNoticias, false);
    carregarDocumentos(dados.DOCUMENTOS);

    console.log("NOTICIAS RECEBIDAS:", dados.NOTICIAS);
    
    document.body.classList.remove("carregando");

  }catch(erro){

    console.error("Erro ao carregar portal:", erro);

  }

}
  
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

  async function abrirMeusContracheques(){
  const modal = document.getElementById("contrachequesModal");
  const lista = document.getElementById("contrachequesLista");

  modal.style.display = "flex";
    document.getElementById("tituloModalContracheques").innerText = "📄 Meus Contracheques";
  lista.innerHTML = "<p>Carregando seus contracheques...</p>";

  const loginSalvo = localStorage.getItem("portalLogin");

  if(!loginSalvo){
    lista.innerHTML = "<p>Sessão expirada. Faça login novamente.</p>";
    return;
  }

  const sessao = JSON.parse(loginSalvo);
  const cpf = sessao.dados.cpf;

  const url =
  API_URL +
  "?action=contracheques" +
  "&cpf=" + encodeURIComponent(cpf) +
  "&v=" + new Date().getTime();

  try{
    const resposta = await fetch(url, {
  cache: "no-store"
});
    const dados = await resposta.json();

    if(!dados.sucesso){
      lista.innerHTML = "<p>" + (dados.mensagem || "Erro ao buscar contracheques.") + "</p>";
      return;
    }

    if(!dados.contracheques || dados.contracheques.length === 0){
      lista.innerHTML = "<p>Nenhum contracheque disponível para este CPF.</p>";
      return;
    }

  const porAno = {};

dados.contracheques.forEach(item => {
  const ano = item.ano || "Sem ano";

  if(!porAno[ano]){
    porAno[ano] = [];
  }

  porAno[ano].push(item);
});

lista.innerHTML = "";

Object.keys(porAno)
  .sort((a,b) => Number(b) - Number(a))
  .forEach(ano => {

    lista.innerHTML += `
  <div class="ano-contracheque">
    <button class="btn-ano-contracheque" onclick="alternarAnoContracheque('${ano}')">
      📅 ${ano}
      <span>▼</span>
    </button>

    <div class="grid-contracheques" id="ano-${ano}" style="display:none;"></div>
  </div>
`;

    const gridAno = lista.querySelector(`#ano-${ano}`);

    porAno[ano]
      .sort((a,b) => Number(b.mes) - Number(a.mes))
      .forEach(item => {
        gridAno.innerHTML += `
  <div class="doc-card" style="height:auto;min-height:170px;">
    <div class="doc-icon">📄</div>
    <h3>${formatarCompetenciaContracheque(item.competencia)}</h3>

    ${
      item.recebido
      ? `
        <p>✅ Recebido</p>
        <a href="${item.link}" target="_blank" class="btn">
          👁 Visualizar
        </a>
      `
      : `
        <p>⏳ Pendente de recebimento</p>
        <button class="btn" onclick="abrirRecebimentoContracheque('${item.competencia}')">
          📥 Receber
        </button>
      `
    }
  </div>
`;      });

  });

  }catch(erro){
    console.error("Erro ao buscar contracheques:", erro);
    lista.innerHTML = "<p>Erro ao carregar contracheques.</p>";
  }
}
async function abrirMeusRecibos(){
  const modal = document.getElementById("contrachequesModal");
  const lista = document.getElementById("contrachequesLista");

  modal.style.display = "flex";
  document.getElementById("tituloModalContracheques").innerText = "📑 Meus Recibos Eletrônicos";
  lista.innerHTML = "<p>Carregando seus recibos eletrônicos...</p>";

  const loginSalvo = localStorage.getItem("portalLogin");

  if(!loginSalvo){
    lista.innerHTML = "<p>Sessão expirada. Faça login novamente.</p>";
    return;
  }

  const sessao = JSON.parse(loginSalvo);
  const cpf = sessao.dados.cpf;

  const url =
    API_URL +
    "?action=recibos" +
    "&cpf=" + encodeURIComponent(cpf) +
    "&v=" + new Date().getTime();

  try{
    const resposta = await fetch(url, {
      cache: "no-store"
    });

    const dados = await resposta.json();

if(!dados.sucesso){
  lista.innerHTML = "<p>" + (dados.mensagem || "Erro ao buscar recibos eletrônicos.") + "</p>";
  return;
}

const recibos = dados.recibos || [];

if(recibos.length === 0){
  lista.innerHTML = "<p>Nenhum recibo eletrônico disponível para este CPF.</p>";
  return;
}

    lista.innerHTML = "";

    recibos.forEach(item => {
      lista.innerHTML += `
        <div class="doc-card" style="height:auto;min-height:190px;">
          <div class="doc-icon">📑</div>

         <h3>${formatarCompetenciaContracheque(item.competencia)}</h3>

          <p>
            <b>Data:</b> ${item.data || "-"}<br>
            <b>Protocolo:</b><br>
            <span style="font-size:11px;word-break:break-word;">
              ${item.protocolo || "-"}
            </span>
          </p>

          <a href="${item.link}" target="_blank" class="btn">
            👁 Visualizar Recibo
          </a>
        </div>
      `;
    });

  }catch(erro){
    console.error("Erro ao buscar recibos:", erro);
    lista.innerHTML = "<p>Erro ao carregar recibos eletrônicos.</p>";
  }
}
  
function abrirAreaRh(){
  document.getElementById("modalAreaRh").style.display = "flex";
}

function fecharAreaRh(){
  document.getElementById("modalAreaRh").style.display = "none";
}
  
function abrirCentralDocumentos(){
  const modal = document.getElementById("contrachequesModal");
  const lista = document.getElementById("contrachequesLista");

  modal.style.display = "flex";

  document.getElementById("tituloModalContracheques").innerText =
    "📂 Central de Documentos";

  lista.innerHTML = `
    <div class="documentos-grid">

      <div class="doc-card" onclick="abrirMeusContracheques()" style="cursor:pointer;">
        <div class="doc-icon">📄</div>
        <h3>Contracheques</h3>
        <p>Visualizar contracheques disponíveis</p>
      </div>

      <div class="doc-card" onclick="abrirMeusRecibos()" style="cursor:pointer;">
        <div class="doc-icon">📑</div>
        <h3>Recibos Eletrônicos</h3>
        <p>Comprovantes de recebimento</p>
      </div>

      <div class="doc-card" onclick="abrirValidacaoRecibo()" style="cursor:pointer;">
        <div class="doc-icon">✅</div>
        <h3>Validar Documento</h3>
        <p>Consultar autenticidade por protocolo</p>
      </div>

    </div>
  `;
}
  console.log("Central de Documentos carregada");
  async function abrirValidacaoRecibo(){
  const modal = document.getElementById("contrachequesModal");
  const lista = document.getElementById("contrachequesLista");

  modal.style.display = "flex";
    document.getElementById("tituloModalContracheques").innerText = "✅ Validar Documento";

  lista.innerHTML = `
    <h2 style="color:#ffc400;margin-bottom:14px;">
      ✅ Validar Documento Eletrônico
    </h2>

    <p style="color:#ddd;margin-bottom:14px;">
      Informe o protocolo do documento para verificar sua autenticidade.
    </p>

    <input
      id="protocoloValidacaoRecibo"
      type="text"
      placeholder="Ex: REC-20260611-192527-8788"
      style="width:100%;padding:14px;border-radius:14px;border:1px solid rgba(255,196,0,.45);background:#111;color:#fff;font-size:15px;margin-bottom:12px;"
    >

    <button class="btn" onclick="validarReciboEletronico()">
      🔎 Validar Documento
    </button>

    <div id="resultadoValidacaoRecibo" style="margin-top:18px;"></div>
  `;
}

  async function validarReciboEletronico(){
  const campo = document.getElementById("protocoloValidacaoRecibo");
  const resultado = document.getElementById("resultadoValidacaoRecibo");

  const protocolo = campo.value.trim();

  if(!protocolo){
    resultado.innerHTML = "<p style='color:#ffc400;'>Informe o protocolo do recibo.</p>";
    return;
  }

  resultado.innerHTML = "<p>Validando protocolo...</p>";

  const url =
    API_URL +
    "?action=validarProtocolo" +
    "&protocolo=" + encodeURIComponent(protocolo) +
    "&v=" + new Date().getTime();

  try{
    const resposta = await fetch(url, {
      cache: "no-store"
    });

    const dados = await resposta.json();

    if(!dados.valido){
      resultado.innerHTML = `
        <div class="doc-card" style="height:auto;min-height:130px;border-color:#d71920;">
          <div class="doc-icon">❌</div>
          <h3>Recibo não encontrado</h3>
          <p>${dados.mensagem || "Protocolo inválido ou inexistente."}</p>
        </div>
      `;
      return;
    }

    resultado.innerHTML = `
      <div class="doc-card" style="height:auto;min-height:210px;border-color:#1f6b2a;">
        <div class="doc-icon">✅</div>
        <h3>Recibo válido</h3>

        <p>
          <b>Protocolo:</b><br>${dados.protocolo}<br><br>
          <b>Nome:</b><br>${dados.nome}<br><br>
          <b>CPF:</b><br>${dados.cpf}<br><br>
          <b>Competência:</b> ${dados.competencia}<br>
          <b>Data/Hora:</b> ${dados.data} às ${dados.hora}<br>
          <b>Status:</b> ${dados.status}
        </p>
      </div>
    `;

  }catch(erro){
    console.error("Erro ao validar recibo:", erro);
    resultado.innerHTML = "<p>Erro ao validar recibo eletrônico.</p>";
  }
}
function fecharMeusContracheques(){
  document.getElementById("contrachequesModal").style.display = "none";
}

function formatarCompetenciaContracheque(comp){

  const meses = {
    "01":"Janeiro",
    "02":"Fevereiro",
    "03":"Março",
    "04":"Abril",
    "05":"Maio",
    "06":"Junho",
    "07":"Julho",
    "08":"Agosto",
    "09":"Setembro",
    "10":"Outubro",
    "11":"Novembro",
    "12":"Dezembro"
  };

  const partes = String(comp || "").split("/");
  const mes = partes[0];
  const ano = partes[1];

  return (meses[mes] || comp) + (ano ? "/" + ano : "");
}
  
  function alternarAnoContracheque(ano){
  const grid = document.getElementById("ano-" + ano);

  if(!grid) return;

  grid.style.display = grid.style.display === "none" ? "flex" : "none";
}
  let competenciaRecebimentoAtual = "";

function abrirRecebimentoContracheque(competencia){
  competenciaRecebimentoAtual = competencia;

  document.getElementById("recebimentoCompetenciaTexto").innerText =
    "Competência: " + formatarCompetenciaContracheque(competencia);

  document.getElementById("aceiteContracheque").checked = false;
  document.getElementById("senhaRecebimento").value = "";
  document.getElementById("mensagemRecebimento").innerText = "";

  document.getElementById("recebimentoModal").style.display = "flex";
}

function fecharRecebimentoContracheque(){
  document.getElementById("recebimentoModal").style.display = "none";
}
function alternarSenhaRecebimento(){

  const campo = document.getElementById("senhaRecebimento");

  if(!campo) return;

  if(campo.type === "password"){
    campo.type = "text";
  }else{
    campo.type = "password";
  }

}
  function identificarVersaoNavegador(){
  const ua = navigator.userAgent;

  if(ua.includes("Edg/")){
    return "Edge " + (ua.match(/Edg\/([\d.]+)/) || [,""])[1];
  }

  if(ua.includes("Chrome/")){
    return "Chrome " + (ua.match(/Chrome\/([\d.]+)/) || [,""])[1];
  }

  if(ua.includes("Firefox/")){
    return "Firefox " + (ua.match(/Firefox\/([\d.]+)/) || [,""])[1];
  }

  if(ua.includes("Safari/") && ua.includes("Version/")){
    return "Safari " + (ua.match(/Version\/([\d.]+)/) || [,""])[1];
  }

  return "Não identificado";
}
  
async function confirmarRecebimentoContracheque(){

  const msg = document.getElementById("mensagemRecebimento");
  const btn = document.getElementById("btnConfirmarRecebimento");

  const aceite = document.getElementById("aceiteContracheque").checked;
  const senha = document.getElementById("senhaRecebimento").value;

  if(!aceite){
    msg.innerText = "Você precisa marcar a declaração de recebimento.";
    return;
  }

  if(!senha){
    msg.innerText = "Digite sua senha para confirmar.";
    return;
  }

  const loginSalvo = localStorage.getItem("portalLogin");

  if(!loginSalvo){
    msg.innerText = "Sessão expirada. Faça login novamente.";
    return;
  }

  btn.disabled = true;
  msg.innerText = "Registrando recebimento...";

  const sessao = JSON.parse(loginSalvo);
  const cpf = sessao.dados.cpf;

  const resolucaoTela = screen.width + "x" + screen.height;
  const versaoNavegador = identificarVersaoNavegador();

let ipPublico = "";
let cidade = "";
let estado = "";
let pais = "";

try{
  
  const respostaIp = await fetch("https://ipapi.co/json/");
  const dadosIp = await respostaIp.json();

  console.log("DADOS IPAPI:", dadosIp);

  ipPublico = dadosIp.ip || "";
  cidade = dadosIp.city || "";
  estado = dadosIp.region || "";
  pais = dadosIp.country_name || "";

}catch(e){
  console.log("Erro ipapi:", e);
}

  const url =
    API_URL +
    "?action=receberContracheque" +
    "&cpf=" + encodeURIComponent(cpf) +
    "&senha=" + encodeURIComponent(senha) +
    "&competencia=" + encodeURIComponent(competenciaRecebimentoAtual) +
    "&navegador=" + encodeURIComponent(versaoNavegador) +
    "&sistema=" + encodeURIComponent(navigator.platform || "") +
    "&dispositivo=" + encodeURIComponent(/Mobi|Android/i.test(navigator.userAgent) ? "Celular" : "Computador") +
    "&resolucao=" + encodeURIComponent(resolucaoTela) +
    "&versaoNavegador=" + encodeURIComponent(versaoNavegador) +
    "&ip=" + encodeURIComponent(ipPublico) +
    "&cidade=" + encodeURIComponent(cidade) +
    "&estado=" + encodeURIComponent(estado) +
    "&pais=" + encodeURIComponent(pais) +
    "&v=" + new Date().getTime();

  try{

    const resposta = await fetch(url, {
      cache: "no-store"
    });

    const dados = await resposta.json();

    console.log("RETORNO RECEBIMENTO:", dados);

    if(!dados.sucesso){

      btn.disabled = false;

      msg.innerText =
        dados.mensagem || "Não foi possível registrar.";

      return;
    }

    msg.innerText =
      "Recebimento confirmado. Protocolo: " +
      dados.protocolo;

    setTimeout(() => {
      fecharRecebimentoContracheque();
      abrirMeusContracheques();
    }, 1200);

  }catch(erro){

    console.error("Erro ao confirmar recebimento:", erro);

    btn.disabled = false;

    msg.innerText =
      "Erro ao registrar recebimento: " +
      erro.message;
  }
}
 function abrirNovoDocumentoRh(){

  document.getElementById("categoriaDocumentoRh").value =
    window.categoriaDocumentoAtual || "";

  document.getElementById("descricaoDocumentoRh").value = "";
  document.getElementById("observacaoDocumentoRh").value = "";
  document.getElementById("dataDocumentoRh").value = "";
  document.getElementById("arquivoDocumentoRh").value = "";
  document.getElementById("documentoAtivoRh").checked = true;
  document.getElementById("mensagemDocumentoRh").innerText = "";

  document.getElementById("modalNovoDocumentoRh").style.display = "flex";
}

function fecharNovoDocumentoRh(){
  document.getElementById("modalNovoDocumentoRh").style.display = "none";
}

async function salvarDocumentoRh(){

  const categoria = document.getElementById("categoriaDocumentoRh").value;
  const descricao = document.getElementById("descricaoDocumentoRh").value;
  const observacao = document.getElementById("observacaoDocumentoRh").value;
  const dataDocumento = document.getElementById("dataDocumentoRh").value;
  const ativo = document.getElementById("documentoAtivoRh").checked ? "SIM" : "NÃO";
  const arquivo = document.getElementById("arquivoDocumentoRh").files[0];
  const msg = document.getElementById("mensagemDocumentoRh");

  if(!descricao){
    msg.innerText = "Informe a descrição.";
    return;
  }

  if(!arquivo){
    msg.innerText = "Selecione um arquivo.";
    return;
  }

  const sessao = JSON.parse(localStorage.getItem("portalLogin"));
  const nomeUsuario = sessao.dados.nome || "";

  msg.innerText = "Preparando arquivo...";

  try{

    const arquivoBase64 = await converterArquivoParaBase64Rh(arquivo);

    msg.innerText = "Enviando para o Drive...";

    const payload = {
      action: "salvarDocumentoFuncionarioRh",
      cpf: cpfCadastroAtual,
      nome: nomeFuncionarioAtual,
      categoria: categoria,
      descricao: descricao,
      observacao: observacao,
      dataDocumento: dataDocumento,
      arquivo: arquivo.name,
      tipoArquivo: arquivo.type || "application/octet-stream",
      arquivoBase64: arquivoBase64,
      usuario: nomeUsuario,
      ativo: ativo
    };

    const resposta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const dados = await resposta.json();

    if(dados.sucesso){

      msg.innerText = "Documento salvo no Drive com sucesso.";

      document.getElementById("descricaoDocumentoRh").value = "";
      document.getElementById("observacaoDocumentoRh").value = "";
      document.getElementById("dataDocumentoRh").value = "";
      document.getElementById("arquivoDocumentoRh").value = "";

      setTimeout(() => {
        fecharNovoDocumentoRh();
        abrirCategoriaDocumentoRh(window.categoriaDocumentoAtual);
      }, 1200);

    }else{
      msg.innerText = dados.mensagem || "Erro ao salvar.";
    }

  }catch(erro){

    console.error(erro);
    msg.innerText = "Erro ao gravar documento no Drive.";

  }
}
  function converterArquivoParaBase64Rh(arquivo){
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => {
      const resultado = leitor.result || "";
      const base64 = String(resultado).split(",")[1];
      resolve(base64);
    };

    leitor.onerror = () => {
      reject("Erro ao ler arquivo.");
    };

    leitor.readAsDataURL(arquivo);
  });
}
  window.abrirDesligadosRh = function(){
  const modal = document.getElementById("modalDesligadosRh");
  if(modal){
    modal.style.display = "flex";
  }else{
    alert("Modal Desligados não encontrado.");
  }
};

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
  
/* AVISOS */
function carregarAvisos(lista, mostrarTodos = false){

  const container = document.getElementById("avisosGrid");

  if(!container) return;

  container.innerHTML = "";

  if(!lista || lista.length === 0){
    container.innerHTML = `
      <div class="rh-vazio">
        Nenhum aviso cadastrado.
      </div>
    `;
    return;
  }

  const avisos = lista
    .filter(a => String(a.ATIVO || "").toUpperCase() === "SIM")
    .sort((a,b)=>Number(a.ORDEM||0)-Number(b.ORDEM||0));

  const exibir = mostrarTodos ? avisos : avisos.slice(0,3);

  exibir.forEach(item=>{

    container.innerHTML += `
      <div class="notice gloss">

        <div class="notice-top"
             style="background:${item.FUNDO || '#b40000'}">

          <h3>${item.TITULO || ""}</h3>

          <p>
            ${item.SUBTITULO || ""}
            <br><br>
            <em>${item.FRASE || ""}</em>
          </p>

        </div>

        <div class="notice-body">

          <h4>${item.TITULO_BAIXO || item.TITULO}</h4>

          <p>${item.DESCRICAO_BAIXO || ""}</p>

         <span class="date">
    🗓 ${formatarData(item.DATA)}
</span>

        </div>

      </div>
    `;

  });

}

/* ANIVERSARIANTES */

function carregarAniversariantes(lista){

    const container =
    document.getElementById("listaAniversariantes");

    if(!container) return;

    container.innerHTML="";

    if(!lista || lista.length==0){

        container.innerHTML=`
        <div class="rh-vazio">
        Nenhum aniversariante.
        </div>`;

        return;
    }

    lista.forEach(item=>{

        container.innerHTML+=`

        <div class="person">

            <div class="person-left">

                <span class="avatar-aniversario">🥳</span>

                <span>${item.NOME}</span>

            </div>

            <span>${item.DATA}</span>

        </div>

        `;

    });

}

/* DESTAQUE */

function carregarDestaque(lista){

    const div=
    document.getElementById("destaqueHome");

    if(!div) return;

    div.innerHTML="";

    if(!lista || lista.length==0){

        div.innerHTML=`
        <div class="rh-vazio">
        Nenhum destaque.
        </div>`;

        return;
    }

    const d=lista[0];

    div.innerHTML=`

        <div class="avatar"
        style="background-image:url('${d.FOTO||""}')">
        </div>

        <h3>${d.NOME||""}</h3>

        <p>${d.TEXTO||""}</p>

    `;

}
 function carregarNoticias(lista, mostrarTodas = false){

  console.log("NOTICIAS COMPLETAS:", lista);

  const container = document.getElementById("noticiasGrid");

  if(!container) return;

  container.innerHTML = "";

  if(!lista || lista.length === 0){
    container.innerHTML = "<p>Nenhuma notícia cadastrada.</p>";
    return;
  }

  const noticiasAtivas = lista.filter(item =>
    String(item.ATIVO || "").trim().toUpperCase() === "SIM"
  );

  if(noticiasAtivas.length === 0){
    container.innerHTML = "<p>Nenhuma notícia ativa. Verifique a coluna ATIVO.</p>";
    return;
  }

  const noticiasExibidas = noticiasAtivas
  .sort((a,b) => Number(a.ORDEM || 0) - Number(b.ORDEM || 0))
  .slice(0, mostrarTodas ? noticiasAtivas.length : 3);

noticiasExibidas.forEach(item=>{

      container.innerHTML += `
        <div class="noticia-home-card gloss"
     data-titulo="${item.TITULO || ""}"
     data-data="${item.DATA || ""}"
     data-imagem="${item.IMAGEM || ""}"
     data-conteudo="${(item.CONTEUDO || item.RESUMO || "").replace(/"/g,'&quot;')}">

          <div class="noticia-home-img"
            style="background-image:url('${item.IMAGEM || ""}')">
          </div>

          <div class="noticia-home-info">
            <h3>${item.TITULO || ""}</h3>
            <p>${item.RESUMO || ""}</p>

            <span class="noticia-home-data">
              📅 ${new Date(item.DATA).toLocaleDateString('pt-BR')}
            </span>
          </div>

        </div>
      `;

    });
     document.querySelectorAll(".noticia-home-card").forEach(card => {

    card.addEventListener("click", () => {

      abrirNoticia({
        TITULO: card.dataset.titulo,
        DATA: card.dataset.data,
        IMAGEM: card.dataset.imagem,
        CONTEUDO: card.dataset.conteudo
      });

    });

  });

}
function carregarGaleria(lista){

  if(!lista || lista.length === 0) return;

  galeriaCompleta = lista
    .filter(item => item.ATIVO === "SIM")
    .sort((a,b) => Number(a.ORDEM) - Number(b.ORDEM));

  const galeriaHome = document.getElementById("galeriaHome");

if(!galeriaHome) return;

galeriaHome.innerHTML = "";

const fotos = [];

  // mistura as fotos por loja
  const porLoja = {};

  galeriaCompleta.forEach(item => {
    if(!porLoja[item.LOJA]){
      porLoja[item.LOJA] = [];
    }
    porLoja[item.LOJA].push(item);
  });

  const lojas = Object.keys(porLoja);
  const destaque = [];

  let rodada = 0;

  while(destaque.length < 6){

    let adicionou = false;

    lojas.forEach(loja => {
      if(porLoja[loja][rodada] && destaque.length < 6){
        destaque.push(porLoja[loja][rodada]);
        adicionou = true;
      }
    });

    if(!adicionou) break;

    rodada++;
  }

  destaque.forEach(item => {

    galeriaHome.innerHTML += `
        <div
            class="gallery-item"
            onclick="abrirImagem('${item.IMAGEM}')"
            style="
                background-image:url('${item.IMAGEM}');
                background-size:cover;
                background-position:center;
            "
            title="${item.TITULO || ""} - ${item.LOJA || ""}">
        </div>
    `;

});

}
  let galeriaCompleta = [];

function abrirGaleria(){
  document.getElementById("galeriaModal").style.display = "block";
  renderizarGaleria(galeriaCompleta);
  preencherFiltros();
}

function fecharGaleria(){
  document.getElementById("galeriaModal").style.display = "none";
}

function preencherFiltros(){

  const lojas = [...new Set(galeriaCompleta.map(item => item.LOJA).filter(Boolean))];
  const categorias = [...new Set(galeriaCompleta.map(item => item.CATEGORIA).filter(Boolean))];

  const filtroLoja = document.getElementById("filtroLoja");
  const filtroCategoria = document.getElementById("filtroCategoria");

  filtroLoja.innerHTML =
    '<option value="">Todas as lojas</option>';

  filtroCategoria.innerHTML =
    '<option value="">Todas categorias</option>';

  lojas.forEach(loja=>{
    filtroLoja.innerHTML += `<option value="${loja}">${loja}</option>`;
  });

  categorias.forEach(cat=>{
    filtroCategoria.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function filtrarGaleria(){

  const loja = document.getElementById("filtroLoja").value;
  const categoria = document.getElementById("filtroCategoria").value;

  let filtrada = galeriaCompleta;

  if(loja){
    filtrada = filtrada.filter(item => item.LOJA === loja);
  }

  if(categoria){
    filtrada = filtrada.filter(item => item.CATEGORIA === categoria);
  }

  renderizarGaleria(filtrada);
}

function renderizarGaleria(lista){

  const grid = document.getElementById("galeriaGrid");

  grid.innerHTML = "";

  lista.forEach(item=>{

   grid.innerHTML += `
  <div class="galeria-item"
     onclick="abrirImagem(this.dataset.img)"
     data-img="${item.IMAGEM}"
     style="background-image:url('${item.IMAGEM}')">

    <div class="galeria-overlay">
      <p>📍 ${item.LOJA || ""}</p>
    </div>

  </div>
`;
  });
}
  function abrirImagem(url){

  document.getElementById("imagemGrande").src = url;

  document.getElementById("imagemModal").style.display = "flex";

}

function fecharImagem(){

  document.getElementById("imagemModal").style.display = "none";

}
  function abrirNoticia(item){

  document.getElementById("noticiaTitulo").innerText =
    item.TITULO || "";

  document.getElementById("noticiaData").innerText =
    item.DATA ? new Date(item.DATA).toLocaleDateString("pt-BR") : "";

  document.getElementById("noticiaImagem").src =
    item.IMAGEM || "";

  document.getElementById("noticiaTexto").innerText =
    item.CONTEUDO || item.RESUMO || "";

  document.getElementById("noticiaModal").style.display =
    "flex";

}

function fecharNoticia(){
  document.getElementById("noticiaModal").style.display = "none";
}
  let documentosCompletos = [];

function carregarDocumentos(lista){

  const grid = document.getElementById("documentosGrid");
  const filtros = document.getElementById("documentosFiltros");

  if(!grid || !filtros) return;

  documentosCompletos = (lista || [])
    .filter(item => String(item.ATIVO || "").trim().toUpperCase() === "SIM")
    .sort((a,b) => Number(a.ORDEM || 0) - Number(b.ORDEM || 0));

  const categorias = [
    ...new Set(documentosCompletos.map(item => item.CATEGORIA).filter(Boolean))
  ];

 filtros.innerHTML = "";

categorias.forEach(cat=>{

  filtros.innerHTML += `
    <button class="categoria-card"
            onclick="filtrarDocumentos('${cat}', this)">
      ${cat}
    </button>
  `;

});

  document.getElementById("documentosGrid").innerHTML = `
  <div class="mensagem-documentos">
    Selecione uma categoria acima.
  </div>
`;
}

function filtrarDocumentos(categoria, botao){

  document.querySelectorAll(".doc-filtro").forEach(btn=>{
    btn.classList.remove("ativo");
  });

  if(botao) botao.classList.add("ativo");

  const filtrados = categoria
    ? documentosCompletos.filter(item => item.CATEGORIA === categoria)
    : documentosCompletos;

  renderizarDocumentos(filtrados);
}

function renderizarDocumentos(lista){

  const grid = document.getElementById("documentosGrid");

  if(!grid) return;

  if(!lista || lista.length === 0){
    grid.innerHTML = "<p>Nenhum documento cadastrado.</p>";
    return;
  }

  grid.innerHTML = "";

  lista
    .filter(item => String(item.ATIVO || "").trim().toUpperCase() === "SIM")
    .sort((a,b) => Number(a.ORDEM || 0) - Number(b.ORDEM || 0))
    .forEach(item=>{

      grid.innerHTML += `
      
        <a href="${item.LINK}" target="_blank" class="doc-card">
          <h3>${item.TITULO || ""}</h3>
          <p>${item.DESCRICAO || ""}</p>
          <span>${item.CATEGORIA || ""}</span>

        </a>
      `;

    });

}
  function abrirDocumentos(){
  document.getElementById("documentosModal").style.display = "flex";
}

function fecharDocumentos(){
  document.getElementById("documentosModal").style.display = "none";
}
  let cpfLoginTemporario = "";
let senhaLoginTemporaria = "";
let cpfLogado = "";
let notificacoesAtuais = [];
let notificacaoAtual = null;


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
 
 carregarPortal();

setTimeout(() => {
  verificarLoginSalvo();
}, 500);

const TELEFONES_RH_LOJAS = {
  COROADO: "5592982554733",
  CENTRO: "5592981708226",
  SAO_JOSE: "5592982352382",
  TURISMO: "5592988170568",
  TORQUATO: "5592992772611",
  JAPIIM: "5592993454607",
  GRANDE_CIRCULAR: "5592982285909"
};

function abrirModalLojas(){
  document.getElementById("modalLojas").style.display = "flex";
}

function fecharModalLojas(){
  document.getElementById("modalLojas").style.display = "none";
}

function abrirWhatsappLoja(loja){
  const telefone = TELEFONES_RH_LOJAS[loja];

  if(!telefone){
    alert("Telefone da loja não encontrado.");
    return;
  }

  const mensagem = "Olá, RH. Vim pelo Portal do Colaborador.";
  const url = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);

  window.open(url, "_blank");
}
  function mostrarTodasNoticias(){
  carregarNoticias(window.todasNoticias || [], true);
}

function mostrarTodosAvisos(){
  carregarAvisos(window.todosAvisos || [], true);
}
 window.listaExperienciaRh = [];

window.carregarExperienciaRh = async function(){

  const tabela =
    document.getElementById("resultadoExperienciaRh");

  const resumo =
    document.getElementById("resumoExperienciaRh");

  const filtroLoja =
    document.getElementById("filtroLojaExperienciaRh");

  tabela.innerHTML =
    "<tr><td colspan='9'>Carregando colaboradores...</td></tr>";

  try{

    const resposta =
      await fetch(
        API_URL +
        "?action=buscarExperienciaRh" +
        "&v=" + Date.now(),
        { cache:"no-store" }
      );

    const dados =
      await resposta.json();

    if(!dados.sucesso){

      tabela.innerHTML =
        "<tr><td colspan='9'>Erro ao carregar funcionários.</td></tr>";

      return;
    }

    window.listaExperienciaRh =
      dados.funcionarios || [];

    // RESUMO
    const total =
      window.listaExperienciaRh.length;

    const urgentes =
      window.listaExperienciaRh.filter(
        x => x.status === "URGENTE"
      ).length;

    const atencao =
      window.listaExperienciaRh.filter(
        x => x.status === "ATENÇÃO"
      ).length;

    const normais =
      window.listaExperienciaRh.filter(
        x => x.status === "EM EXPERIÊNCIA"
      ).length;

    resumo.innerHTML = `
      <div style="
        display:flex;
        gap:25px;
        flex-wrap:wrap;
        font-weight:bold;
      ">
        <span>⏳ Funcionários em Experiência: ${total}</span>
        <span style="color:#dc3545;">🔴 Urgentes: ${urgentes}</span>
        <span style="color:#ffc107;">🟡 Atenção: ${atencao}</span>
        <span style="color:#28a745;">🟢 Normais: ${normais}</span>
      </div>
    `;

    // MONTA FILTRO DE LOJAS
    const lojas =
      [...new Set(
        window.listaExperienciaRh.map(x => x.loja)
      )]
      .sort();

    filtroLoja.innerHTML =
      '<option value="">Todas as Lojas</option>';

    lojas.forEach(loja => {

      filtroLoja.innerHTML += `
        <option value="${loja}">
          ${loja}
        </option>
      `;

    });

    renderizarExperienciaRh(
      window.listaExperienciaRh
    );

  }catch(erro){

    console.error(erro);

    tabela.innerHTML =
      "<tr><td colspan='9'>Erro ao carregar funcionários.</td></tr>";

  }

};
  function renderizarExperienciaRh(lista){

  const tabela =
    document.getElementById("resultadoExperienciaRh");

  let html = "";

  lista.forEach(f => {

    let corStatus = "#28a745";

    if(f.status === "ATENÇÃO"){
      corStatus = "#ffc107";
    }

    if(f.status === "URGENTE"){
      corStatus = "#dc3545";
    }

    html += `
      <tr>
        <td>${f.nome}</td>
        <td>${f.loja}</td>
        <td>${f.funcao}</td>
        <td>${f.admissao}</td>
        <td>${f.contrato1}</td>
        <td>${f.contrato2}</td>
        <td>${f.dias}</td>
        <td>
          <span style="
            color:${corStatus};
            font-weight:bold;
          ">
            ${f.status}
          </span>
        </td>
        <td>
          <button onclick="abrirCadastroCompletoRh('${f.cpf}')">
            👁 Ver Cadastro
          </button>
        </td>
      </tr>
    `;
  });

  tabela.innerHTML = html;
}
  function aplicarFiltroExperienciaRh(){

  const loja =
    document.getElementById(
      "filtroLojaExperienciaRh"
    ).value;

  const status =
    document.getElementById(
      "filtroStatusExperienciaRh"
    ).value;

  let lista =
    [...window.listaExperienciaRh];

  if(loja){

    lista =
      lista.filter(
        x => x.loja === loja
      );

  }

  if(status){

    lista =
      lista.filter(
        x => x.status === status
      );

  }

  renderizarExperienciaRh(lista);

}
  
window.abrirNovoFuncionarioRh = function(){

  ModalSCRV.abrir("modalNovoFuncionarioRh");

};
window.fecharModalRh = function(id){

  ModalSCRV.fechar(id);

};
 window.abrirExperienciaRh = async function(){

  ModalSCRV.fechar("modalFuncionariosRh");

  ModalSCRV.abrir("modalExperienciaRh");

  await carregarExperienciaRh();

};

    function formatarData(valor){

  if(!valor) return "-";

  const data = new Date(valor);

  if(isNaN(data.getTime())){
    return valor;
  }

  return data.toLocaleDateString("pt-BR",{
    timeZone:"America/Manaus"
  });

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

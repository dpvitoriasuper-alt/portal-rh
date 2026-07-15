console.log("APP.JS VERSÃO TESTE 17:58");
const API_URL = "https://script.google.com/macros/s/AKfycbz4aLtDg_OEpJ2PD9fyVGlfmSsjFY8MBiZoCJIgE2i79Qe_XYUY-XBNjFhpSG4gtb8/exec";

// ================================
// GERENCIADOR DE MODAIS SCRV
// ================================
const PilhaModaisSCRV = [];
let modalOrigemRh = "";

// Daqui para baixo começam as funções

  
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

function abrirAreaRh(){
  document.getElementById("modalAreaRh").style.display = "flex";
}

function fecharAreaRh(){
  document.getElementById("modalAreaRh").style.display = "none";
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

 carregarPortal();

setTimeout(() => {
  verificarLoginSalvo();
}, 500);

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

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

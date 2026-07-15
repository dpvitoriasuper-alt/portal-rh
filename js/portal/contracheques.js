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

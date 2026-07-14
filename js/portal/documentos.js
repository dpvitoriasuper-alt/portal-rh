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

let htmlFiltros = "";

categorias.forEach(cat => {

    htmlFiltros += `
        <button
            class="categoria-card"
            onclick="filtrarDocumentos('${cat}', this)">
            ${cat}
        </button>
    `;

});

filtros.innerHTML = htmlFiltros;

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

  let html = "";

  lista
    .filter(item => String(item.ATIVO || "").trim().toUpperCase() === "SIM")
    .sort((a,b) => Number(a.ORDEM || 0) - Number(b.ORDEM || 0))
    .forEach(item => {

      html += `
        <a href="${item.LINK || "#"}"
           target="_blank"
           class="doc-card">

          <h3>${item.TITULO || ""}</h3>

          <p>${item.DESCRICAO || ""}</p>

          <span>${item.CATEGORIA || ""}</span>

        </a>
      `;

    });

  grid.innerHTML = html;

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

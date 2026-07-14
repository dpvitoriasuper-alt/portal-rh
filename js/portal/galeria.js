/**********************************************************************
 * SCRV - Galeria
 **********************************************************************/

let galeriaCompleta = [];

/**********************************************************************
 * Carrega Galeria Home
 **********************************************************************/

function carregarGaleria(lista){

  if(!lista || lista.length === 0) return;

  galeriaCompleta = lista
    .filter(item => String(item.ATIVO || "").trim().toUpperCase() === "SIM")
    .sort((a,b) => Number(a.ORDEM || 0) - Number(b.ORDEM || 0));

  const galeriaHome = document.getElementById("galeriaHome");

  if(!galeriaHome) return;

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

      if(
        porLoja[loja][rodada] &&
        destaque.length < 6
      ){

        destaque.push(porLoja[loja][rodada]);
        adicionou = true;

      }

    });

    if(!adicionou) break;

    rodada++;

  }

  let html = "";

  destaque.forEach(item => {

    html += `
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

  galeriaHome.innerHTML = html;

}

/**********************************************************************
 * Modal
 **********************************************************************/

function abrirGaleria(){

  document.getElementById("galeriaModal").style.display = "block";

  preencherFiltros();

  renderizarGaleria(galeriaCompleta);

}

function fecharGaleria(){

  document.getElementById("galeriaModal").style.display = "none";

}

/**********************************************************************
 * Filtros
 **********************************************************************/

function preencherFiltros(){

  const lojas = [
    ...new Set(
      galeriaCompleta
        .map(item => item.LOJA)
        .filter(Boolean)
    )
  ];

  const categorias = [
    ...new Set(
      galeriaCompleta
        .map(item => item.CATEGORIA)
        .filter(Boolean)
    )
  ];

  const filtroLoja =
    document.getElementById("filtroLoja");

  const filtroCategoria =
    document.getElementById("filtroCategoria");

  let htmlLojas =
    `<option value="">Todas as lojas</option>`;

  lojas.forEach(loja => {

    htmlLojas += `
      <option value="${loja}">
        ${loja}
      </option>
    `;

  });

  filtroLoja.innerHTML = htmlLojas;

  let htmlCategorias =
    `<option value="">Todas categorias</option>`;

  categorias.forEach(cat => {

    htmlCategorias += `
      <option value="${cat}">
        ${cat}
      </option>
    `;

  });

  filtroCategoria.innerHTML = htmlCategorias;

}

/**********************************************************************
 * Filtrar
 **********************************************************************/

function filtrarGaleria(){

  const loja =
    document.getElementById("filtroLoja").value;

  const categoria =
    document.getElementById("filtroCategoria").value;

  let filtrada = galeriaCompleta;

  if(loja){

    filtrada =
      filtrada.filter(item => item.LOJA === loja);

  }

  if(categoria){

    filtrada =
      filtrada.filter(item => item.CATEGORIA === categoria);

  }

  renderizarGaleria(filtrada);

}

/**********************************************************************
 * Renderizar
 **********************************************************************/

function renderizarGaleria(lista){

  const grid =
    document.getElementById("galeriaGrid");

  if(!grid) return;

  if(!lista || lista.length === 0){

    grid.innerHTML = `
      <div class="rh-vazio">
        Nenhuma imagem encontrada.
      </div>
    `;

    return;

  }

  let html = "";

  lista.forEach(item => {

    html += `
      <div
        class="galeria-item"
        onclick="abrirImagem('${item.IMAGEM}')"
        style="background-image:url('${item.IMAGEM}')">

        <div class="galeria-overlay">

          <p>📍 ${item.LOJA || ""}</p>

        </div>

      </div>
    `;

  });

  grid.innerHTML = html;

}

/**********************************************************************
 * Imagem
 **********************************************************************/

function abrirImagem(url){

  document.getElementById("imagemGrande").src = url;

  document.getElementById("imagemModal").style.display = "flex";

}

function fecharImagem(){

  document.getElementById("imagemModal").style.display = "none";

}

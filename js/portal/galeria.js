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

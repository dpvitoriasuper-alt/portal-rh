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
function mostrarTodasNoticias(){
  carregarNoticias(window.todasNoticias || [], true);
}

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
function mostrarTodosAvisos(){
  carregarAvisos(window.todosAvisos || [], true);
}

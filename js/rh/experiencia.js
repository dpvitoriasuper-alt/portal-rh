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
   window.abrirExperienciaRh = async function(){

  ModalSCRV.fechar("modalFuncionariosRh");

  ModalSCRV.abrir("modalExperienciaRh");

  await carregarExperienciaRh();

};


 async function excluirDocumentoRh(idDocumento){

  if(!confirm("Deseja realmente excluir este documento?")){
    return;
  }

  const sessao =
    JSON.parse(localStorage.getItem("portalLogin"));

  const usuario =
    sessao?.dados?.nome || "USUARIO";

  try{

    const url =
      API_URL +
      "?action=excluirDocumentoFuncionarioRh" +
      "&idDocumento=" + encodeURIComponent(idDocumento) +
      "&usuario=" + encodeURIComponent(usuario) +
      "&v=" + new Date().getTime();

    const resposta =
      await fetch(url,{cache:"no-store"});

    const dados =
      await resposta.json();

    if(!dados.sucesso){

      alert(
        dados.mensagem ||
        "Erro ao excluir documento."
      );

      return;
    }

    alert("Documento movido para a lixeira.");

    abrirCategoriaDocumentoRh(
      window.categoriaDocumentoAtual
    );

  }catch(erro){

    console.error(erro);

    alert(
      "Erro ao excluir documento."
    );

  }
}
  async function abrirCategoriaDocumentoRh(categoria, somenteContar){

  window.categoriaDocumentoAtual = categoria;

  const lista = document.getElementById("listaArquivosCategoriaRh");

  if(!somenteContar){
    document.getElementById("tituloCategoriaDocumentoRh").innerText = categoria;
    document.getElementById("modalCategoriaDocumentoRh").style.display = "flex";

    lista.innerHTML = `
      <tr>
        <td colspan="4" class="rh-vazio">
          Carregando documentos...
        </td>
      </tr>
    `;
  }

  const url =
    API_URL +
    "?action=buscarDocumentosFuncionarioRh" +
    "&cpf=" + encodeURIComponent(cpfCadastroAtual) +
    "&categoria=" + encodeURIComponent(categoria) +
    "&v=" + new Date().getTime();

  try{

    const resposta = await fetch(url, { cache: "no-store" });
    const dados = await resposta.json();

    atualizarQuantidadeCategoriaRh(
      categoria,
      dados.quantidade || 0
    );

    if(somenteContar){
      return;
    }

    if(!dados.sucesso){
      lista.innerHTML = `
        <tr>
          <td colspan="4" class="rh-vazio">
            ${dados.mensagem || "Erro ao buscar documentos."}
          </td>
        </tr>
      `;
      return;
    }

    if(!dados.documentos || dados.documentos.length === 0){
      lista.innerHTML = `
        <tr>
          <td colspan="4" class="rh-vazio">
            Nenhum arquivo nesta categoria.
          </td>
        </tr>
      `;
      return;
    }

    lista.innerHTML = "";

   dados.documentos.forEach(doc => {

  lista.innerHTML += `
    <tr>

      <td>${doc.arquivo || "-"}</td>

      <td>
        ${formatarDataHoraRh(doc.data)}
      </td>

      <td>
        ${doc.usuario || "-"}
      </td>

      <td>

        <a
          href="https://drive.google.com/file/d/${doc.arquivoId}/view"
          target="_blank">
          👁
        </a>

        &nbsp;

        <a
          href="https://drive.google.com/uc?export=download&id=${doc.arquivoId}"
          target="_blank">
          ⬇
        </a>

        &nbsp;

        <button
          onclick="excluirDocumentoRh('${doc.id}')">
          🗑
        </button>

      </td>

    </tr>
  `;

});
  }catch(erro){

    console.error("Erro ao carregar documentos:", erro);

    if(!somenteContar){
      lista.innerHTML = `
        <tr>
          <td colspan="4" class="rh-vazio">
            Erro ao carregar documentos.
          </td>
        </tr>
      `;
    }
  }
}
  function carregarQuantidadesDocumentosRh(){

  const linhas = document.querySelectorAll("#aba_documentos tbody tr");

  linhas.forEach(linha => {

    const categoria = linha.cells[0]?.innerText || "";

    if(!categoria) return;

    abrirCategoriaDocumentoRh(categoria, true);

  });

}
  function atualizarQuantidadeCategoriaRh(categoria, quantidade){

  const linhas = document.querySelectorAll("#aba_documentos tbody tr");

  linhas.forEach(linha => {

    const categoriaLinha = linha.cells[0]?.innerText || "";

    if(categoriaLinha.trim() === categoria.trim()){
      linha.cells[1].innerText = quantidade;
    }

  });

}

function fecharCategoriaDocumentoRh(){
  document.getElementById("modalCategoriaDocumentoRh").style.display = "none";
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

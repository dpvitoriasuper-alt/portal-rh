async function fazerLogin(){

  const cpf = document.getElementById("loginCpf").value;
  const senha = document.getElementById("loginSenha").value;
  const msg = document.getElementById("loginMensagem");

  cpfLoginTemporario = cpf;
  senhaLoginTemporaria = senha;

  if(!cpf){
    msg.innerText = "Informe o CPF.";
    return;
  }

  if(!senha){
    msg.innerText = "Informe sua senha ou sua data de nascimento no primeiro acesso.";
    return;
  }

  msg.innerText = "Verificando acesso...";

  const url =
    API_URL +
    "?action=login" +
    "&cpf=" + encodeURIComponent(cpf) +
    "&senha=" + encodeURIComponent(senha);

  try{
    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log("RESPOSTA LOGIN:", dados);

    if(!dados.sucesso){
      msg.innerText = dados.mensagem || "Acesso não autorizado.";
      return;
    }

    if(dados.primeiroAcesso){
      msg.innerText = "Bem-vindo, " + dados.nome + ". Crie sua senha.";
      document.getElementById("primeiroAcessoBox").style.display = "block";
      document.getElementById("formLogin").style.display = "none";
      document.getElementById("loginInstrucao").innerText = "Primeiro acesso confirmado. Agora crie sua senha.";
      document.getElementById("novaSenha").focus();
      return;
    }

    liberarPortal(dados);

  }catch(erro){
    console.error("ERRO NO LOGIN:", erro);
    msg.innerText = "Erro ao acessar. Tente novamente.";
  }
}

async function criarSenhaPortal(){

  const nova = document.getElementById("novaSenha").value;
  const confirma = document.getElementById("confirmaSenha").value;
  const msg = document.getElementById("loginMensagem");

  if(!nova){
    msg.innerText = "Digite a nova senha.";
    return;
  }

  if(nova.length < 6){
    msg.innerText = "A senha precisa ter pelo menos 6 caracteres.";
    return;
  }

  if(senhaEhFacil(nova)){
    msg.innerText = "Senha muito fácil. Escolha outra e tente novamente.";
    return;
  }

  if(nova !== confirma){
    msg.innerText = "As senhas não conferem.";
    return;
  }

  msg.innerText = "Salvando nova senha...";

  try{

    const url =
      API_URL +
      "?action=login" +
      "&cpf=" + encodeURIComponent(cpfLoginTemporario) +
      "&senha=" + encodeURIComponent(senhaLoginTemporaria) +
      "&novaSenha=" + encodeURIComponent(nova);

    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log("RESPOSTA CRIAR SENHA:", dados);

    if(dados.sucesso){
      msg.innerText = "Senha criada com sucesso!";
      liberarPortal(dados);
    }else{
      msg.innerText = dados.mensagem || "Erro ao criar senha.";
    }

  }catch(erro){
    console.error("ERRO AO CRIAR SENHA:", erro);
    msg.innerText = "Erro ao salvar senha. Tente novamente.";
  }
}

function senhaEhFacil(senha){
  const senhaLimpa = String(senha || "").trim().toLowerCase();

  const fracas = [
    "123456",
    "1234567",
    "12345678",
    "123456789",
    "1234",
    "12345",
    "111111",
    "000000",
    "654321",
    "abcdef",
    "abc123",
    "senha",
    "senha123",
    "qwerty",
    "11111111"
  ];

  if(fracas.includes(senhaLimpa)) return true;
  if(/^(\d)\1+$/.test(senhaLimpa)) return true;

  return false;
}
  function sairPortal(){

  localStorage.removeItem("portalLogin");

  cpfLogado = "";

  document.getElementById("loginTela").style.display = "flex";
  document.getElementById("areaColaborador").style.display = "none";

  location.reload();
}
  
function liberarPortal(dados){

  console.log("DADOS LOGIN:", dados);

  localStorage.setItem("portalLogin", JSON.stringify({
    dados: dados,
    expira: new Date().getTime() + (24 * 60 * 60 * 1000)
  }));

  cpfLogado = dados.cpf || cpfLoginTemporario || "";

  document.getElementById("loginTela").style.display = "none";
  document.body.classList.remove("carregando");

  preencherPerfilColaborador(dados);
  carregarNotificacoesColaborador(dados.notificacoes || []);

  if (
    dados.perfilAcesso === "RH" ||
    dados.perfilAcesso === "ADMIN"
  ) {
    console.log("USUÁRIO RH/ADMIN");

    const menuRh = document.getElementById("menuRh");

    if (menuRh) {
      menuRh.style.display = "block";
    }
  }

}
 function mostrarSenha(idCampo, botao){
  const campo = document.getElementById(idCampo);

  if(campo.type === "password"){
    campo.type = "text";
    botao.innerText = "🙈";
  }else{
    campo.type = "password";
    botao.innerText = "👁️";
  }
}
async function verificarLoginSalvo(){

  const loginSalvo = localStorage.getItem("portalLogin");

  if(!loginSalvo) return false;

  try{
    const sessao = JSON.parse(loginSalvo);

    if(new Date().getTime() > sessao.expira){
      localStorage.removeItem("portalLogin");
      return false;
    }

    const cpf = sessao.dados.cpf || "";

    const url =
      API_URL +
      "?action=validarSessaoPortal" +
      "&cpf=" + encodeURIComponent(cpf) +
      "&v=" + new Date().getTime();

    const resposta = await fetch(url, { cache: "no-store" });
    const dados = await resposta.json();

    if(!dados.sucesso){
      localStorage.removeItem("portalLogin");
      alert(dados.mensagem || "Seu acesso foi bloqueado.");
      location.reload();
      return false;
    }

    sessao.dados = dados.dados;
    localStorage.setItem("portalLogin", JSON.stringify(sessao));

    liberarPortal(dados.dados);
    return true;

  }catch(erro){
    localStorage.removeItem("portalLogin");
    return false;
  }
}

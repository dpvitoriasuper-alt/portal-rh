/**
 * ==========================================================
 * SCRV.Processamento
 * ==========================================================
 */

SCRV.Processamento = {

    id: null,

    timer: null,

    ultimoSeq: 0,

    ativo: false,

    dados: {}

};
SCRV.Processamento.iniciar = function(config){

    this.reset();

    this.id = config.id;

    this.abrir();

    this.monitorar();

}

SCRV.Processamento.monitorar = function(){

    if(this.timer){

        clearInterval(this.timer);

    }

    this.timer = setInterval(async ()=>{

        await this.buscarStatus();

    },2000);

};
SCRV.Processamento.buscarStatus = async function(){

    const resposta = await SCRV.Http.post({

        action:"consultarProcessamentoSCRV",

        id:this.id,

        ultimoSeq:this.ultimoSeq

    });

    if(!resposta.sucesso){

        return;

    }

    this.render(resposta);

};
SCRV.Processamento.encerrar = function(){

    this.ativo=false;

    clearInterval(this.timer);

    this.timer=null;

};
SCRV.Processamento.abrir = function(){

    SCRV.UI.Modal.abrir("modalProcessamentoSCRV");

}
SCRV.Processamento.fechar = function(){

    SCRV.UI.Modal.fechar("modalProcessamentoSCRV");

}
SCRV.Processamento.reset = function(){

    document.getElementById("scrvProgressBar").style.width="0%";

    document.getElementById("scrvPercentual").innerHTML="0%";

    document.getElementById("scrvPaginaAtual").innerHTML="0 / 0";

    document.getElementById("scrvImportados").innerHTML="0";

    document.getElementById("scrvPendencias").innerHTML="0";

    document.getElementById("scrvErros").innerHTML="0";

    document.getElementById("scrvTempo").innerHTML="00:00";

    document.getElementById("scrvLogConteudo").innerHTML="";

    document.getElementById("scrvBtnRelatorio").style.display="none";

    document.getElementById("scrvBtnFechar").style.display="none";

    this.logsRecebidos = new Set();

}

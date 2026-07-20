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

    this.id = config.id;

    this.ultimoSeq = 0;

    this.ativo = true;

    this.dados = {};

    this.abrir();

    this.monitorar();

};
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

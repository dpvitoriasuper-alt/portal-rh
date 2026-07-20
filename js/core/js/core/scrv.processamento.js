/**
 * ============================================================
 * SCRV.Processamento
 * Central de Processamento do SCRV
 * ============================================================
 */

SCRV.Processamento = {

    dados: {

        ativo: false,

        tipo: "",

        titulo: "",

        arquivo: "",

        percentual: 0,

        paginaAtual: 0,

        totalPaginas: 0,

        processados: 0,

        pendencias: 0,

        erros: 0,

        tempo: "00:00",

        logs: []

    }

};
SCRV.Processamento.iniciar = function (dados) {

    this.dados.ativo = true;

    this.dados.tipo = dados.tipo || "";

    this.dados.titulo = dados.titulo || "";

    this.dados.arquivo = dados.arquivo || "";

    this.dados.percentual = 0;

    this.dados.paginaAtual = 0;

    this.dados.totalPaginas = 0;

    this.dados.processados = 0;

    this.dados.pendencias = 0;

    this.dados.erros = 0;

    this.dados.logs = [];

    console.log("SCRV.Processamento iniciado");

    console.table(this.dados);

};

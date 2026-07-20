/**
 * ==========================================================
 * SCRV.Http
 * Comunicação com o Backend
 * ==========================================================
 */

SCRV.Http = {};
SCRV.Http.post = async function (dados) {

    try {

        const resposta = await fetch(API_URL, {

            method: "POST",

            body: JSON.stringify(dados)

        });

        return await resposta.json();

    } catch (erro) {

        console.error("SCRV.Http.post", erro);

        return {

            sucesso: false,

            mensagem: "Erro de comunicação com o servidor."

        };

    }

};
SCRV.Http.upload = async function ({
    action,
    arquivo,
    dados = {}
}) {

    return new Promise((resolve, reject) => {

        const leitor = new FileReader();

        leitor.onload = async () => {

            try {

                const resposta = await fetch(API_URL, {

                    method: "POST",

                    body: JSON.stringify({

                        action,

                        nomeArquivo: arquivo.name,

                        tipoArquivo: arquivo.type,

                        arquivoBase64: leitor.result.split(",")[1],

                        ...dados

                    })

                });

                resolve(await resposta.json());

            } catch (e) {

                reject(e);

            }

        };

        leitor.readAsDataURL(arquivo);

    });

};
const dados = await SCRV.Http.post({

    action: "consultarProcessamentoSCRV",

    id: idProcessamento,

    ultimoSeq

});
const resposta = await SCRV.Http.upload({

    action: "uploadImportacaoContracheques",

    arquivo

});

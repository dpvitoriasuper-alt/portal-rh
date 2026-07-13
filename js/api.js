/**********************************************************************
 * SCRV API
 **********************************************************************/

SCRV.API.get = async function(action, parametros = {}) {

    const url = new URL(API_URL);

    url.searchParams.set("action", action);

    Object.entries(parametros).forEach(([chave, valor]) => {

        if (
            valor !== undefined &&
            valor !== null &&
            valor !== ""
        ) {

            url.searchParams.set(chave, valor);

        }

    });

    url.searchParams.set("_", Date.now());

    const resposta = await fetch(url, {

        cache: "no-store"

    });

    return await resposta.json();

};

SCRV.API.post = async function(action, dados = {}) {

    dados.action = action;

    const resposta = await fetch(API_URL, {

        method: "POST",

        body: JSON.stringify(dados)

    });

    return await resposta.json();

};

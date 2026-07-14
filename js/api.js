/**********************************************************************
 * SCRV API
 **********************************************************************/

SCRV.API.get = async function(action, parametros = {}) {

    try{

        const url = new URL(API_URL);

        url.searchParams.set("action", action);

        Object.entries(parametros).forEach(([chave, valor]) => {

            if(
                valor !== undefined &&
                valor !== null &&
                valor !== ""
            ){
                url.searchParams.set(chave, valor);
            }

        });

        url.searchParams.set("_", Date.now());

        const resposta = await fetch(url,{
            cache:"no-store"
        });

        if(!resposta.ok){
            throw new Error(`HTTP ${resposta.status}`);
        }

        return await resposta.json();

    }catch(erro){

        console.error("SCRV.API.get:", erro);

        return {
            sucesso:false,
            mensagem:"Erro de comunicação com o servidor."
        };

    }

};

SCRV.API.post = async function(action,dados={}){

    try{

        dados.action = action;

        const resposta = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(dados)

        });

        if(!resposta.ok){
            throw new Error(`HTTP ${resposta.status}`);
        }

        return await resposta.json();

    }catch(erro){

        console.error("SCRV.API.post:", erro);

        return{
            sucesso:false,
            mensagem:"Erro de comunicação com o servidor."
        };

    }

};

/**********************************************************************
 * SCRV Utils
 **********************************************************************/

SCRV.Utils.formatarData = function(valor){

    if(!valor) return "-";

    const data = new Date(valor);

    if(isNaN(data)) return valor;

    return data.toLocaleDateString("pt-BR",{

        timeZone:"America/Manaus"

    });

};

SCRV.Utils.formatarDataHora = function(valor){

    if(!valor) return "-";

    const data = new Date(valor);

    if(isNaN(data)) return valor;

    return data.toLocaleString("pt-BR",{

        timeZone:"America/Manaus",

        day:"2-digit",
        month:"2-digit",
        year:"numeric",

        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit"

    });

};

SCRV.Utils.formatarMoeda = function(valor){

    if(valor===null || valor==="") return "-";

    const numero = Number(valor);

    if(isNaN(numero)) return valor;

    return numero.toLocaleString("pt-BR",{

        style:"currency",

        currency:"BRL"

    });

};

function formatarData(valor){

  if(!valor) return "-";

  const data = new Date(valor);

  if(isNaN(data.getTime())){
    return valor;
  }

  return data.toLocaleDateString("pt-BR",{
    timeZone:"America/Manaus"
  });

}

/**********************************************************************
 * HOME DO PORTAL
 **********************************************************************/

function carregarAniversariantes(lista){

    const container =
    document.getElementById("listaAniversariantes");

    if(!container) return;

    container.innerHTML = "";

    if(!lista || lista.length === 0){

        container.innerHTML = `
            <div class="rh-vazio">
                Nenhum aniversariante.
            </div>
        `;

        return;
    }

    let html = "";

    lista.forEach(item => {

        html += `
            <div class="person">

                <div class="person-left">

                    <span class="avatar-aniversario">🥳</span>

                    <span>${item.NOME}</span>

                </div>

                <span>${item.DATA}</span>

            </div>
        `;

    });

    container.innerHTML = html;

}



function carregarDestaque(lista){

    const div =
    document.getElementById("destaqueHome");

    if(!div) return;

    div.innerHTML = "";

    if(!lista || lista.length === 0){

        div.innerHTML = `
            <div class="rh-vazio">
                Nenhum destaque.
            </div>
        `;

        return;

    }

    const d = lista[0];

    div.innerHTML = `
        <div
            class="avatar"
            style="background-image:url('${d.FOTO || ""}')">
        </div>

        <h3>${d.NOME || ""}</h3>

        <p>${d.TEXTO || ""}</p>
    `;

}

/**********************************************************************
 * SCRV
 * RH - Funcionários
 **********************************************************************/

window.abrirFuncionariosRh = function () {
    ModalSCRV.abrir("modalFuncionariosRh");
};

window.fecharFuncionariosRh = function () {
    ModalSCRV.fechar("modalFuncionariosRh");
};

window.pesquisarFuncionarioRh = function () {
    pesquisarFuncionariosRh();
};

async function pesquisarFuncionariosRh() {

    const input = document.getElementById("pesquisaFuncionarioRh");
    const corpoTabela = document.getElementById("resultadoFuncionariosRh");

    if (!input || !corpoTabela) {
        console.error("Elementos da pesquisa RH não encontrados.");
        return;
    }

    const termo = input.value.trim();

    const loginSalvo = localStorage.getItem("portalLogin");

    if (!loginSalvo) {

        corpoTabela.innerHTML = `
            <tr>
                <td colspan="7" class="rh-vazio">
                    Sessão expirada.
                </td>
            </tr>
        `;

        return;

    }

    const sessao = JSON.parse(loginSalvo);

    const cpfUsuario = sessao?.dados?.cpf || "";

    if (!termo) {

        corpoTabela.innerHTML = `
            <tr>
                <td colspan="7" class="rh-vazio">
                    Digite um nome, CPF ou matrícula.
                </td>
            </tr>
        `;

        return;

    }

    corpoTabela.innerHTML = `
        <tr>
            <td colspan="7" class="rh-vazio">
                Pesquisando...
            </td>
        </tr>
    `;

    try {

        const resposta = await fetch(

            API_URL +
            "?action=portalRhPesquisarFuncionarios" +
            "&termo=" + encodeURIComponent(termo) +
            "&cpfUsuario=" + encodeURIComponent(cpfUsuario) +
            "&v=" + Date.now(),

            {
                cache: "no-store"
            }

        );

        const dados = await resposta.json();

        if (!dados.sucesso) {

            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="7" class="rh-vazio">
                        ${dados.mensagem || "Erro"}
                    </td>
                </tr>
            `;

            return;

        }

        if (!dados.resultados?.length) {

            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="7" class="rh-vazio">
                        Nenhum funcionário encontrado.
                    </td>
                </tr>
            `;

            return;

        }

        let html = "";

        dados.resultados.forEach(func => {

            html += `
                <tr>

                    <td>${func.nome || "-"}</td>

                    <td>${func.cpf || "-"}</td>

                    <td>${func.matricula || "-"}</td>

                    <td>${func.loja || "-"}</td>

                    <td>${func.funcao || "-"}</td>

                    <td>${func.status || "ATIVO"}</td>

                    <td>

                        <button
                            onclick="abrirCadastroCompletoRh('${func.cpf}')">

                            👁 Ver cadastro

                        </button>

                    </td>

                </tr>
            `;

        });

        corpoTabela.innerHTML = html;

    } catch (erro) {

        console.error(erro);

        corpoTabela.innerHTML = `
            <tr>
                <td colspan="7" class="rh-vazio">
                    Erro ao pesquisar funcionários.
                </td>
            </tr>
        `;

    }

}

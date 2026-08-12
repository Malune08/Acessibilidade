document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // MODAL DE ACESSIBILIDADE
    // ==========================================

    const modalA11y = document.getElementById('modal-a11y');
    const btnAbrirA11y = document.getElementById('btn-abrir-a11y');
    const btnFecharA11y = document.getElementById('btn-fechar-a11y');
    const btnRestaurar = document.getElementById('btn-restaurar');

    const toggleContraste = document.getElementById('toggle-contraste');
    const toggleTexto = document.getElementById('toggle-texto');
    const toggleDislexia = document.getElementById('toggle-dislexia');
    const toggleLinks = document.getElementById('toggle-links');

    if (btnAbrirA11y) {
        btnAbrirA11y.addEventListener('click', () => modalA11y.showModal());
    }

    if (btnFecharA11y) {
        btnFecharA11y.addEventListener('click', () => modalA11y.close());
    }

    if (modalA11y) {
        modalA11y.addEventListener('click', (event) => {
            const rect = modalA11y.getBoundingClientRect();

            if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
            ) {
                modalA11y.close();
            }
        });
    }

    function aplicarAcessibilidade(toggle, classe, storage) {

        if (!toggle) return;

        if (localStorage.getItem(storage) === 'true') {
            toggle.checked = true;
            document.body.classList.add(classe);
        }

        toggle.addEventListener('change', () => {
            document.body.classList.toggle(classe, toggle.checked);
            localStorage.setItem(storage, toggle.checked);
        });
    }

    aplicarAcessibilidade(toggleContraste, 'modo-alto-contraste', 'a11y_contraste');
    aplicarAcessibilidade(toggleTexto, 'modo-texto-grande', 'a11y_texto');
    aplicarAcessibilidade(toggleDislexia, 'modo-dislexia', 'a11y_dislexia');
    aplicarAcessibilidade(toggleLinks, 'modo-sublinhar', 'a11y_links');

    btnRestaurar?.addEventListener('click', () => {
        document.body.classList.remove(
            'modo-alto-contraste',
            'modo-texto-grande',
            'modo-dislexia',
            'modo-sublinhar'
        );

        toggleContraste.checked = false;
        toggleTexto.checked = false;
        toggleDislexia.checked = false;
        toggleLinks.checked = false;

        localStorage.clear();
    });

    // ==========================================
    // CADASTRO (ETAPA 2 - ENDEREÇO)
    // ==========================================

    const form = document.getElementById("form-endereco");
    const btnCadastrarDepois = document.getElementById("btn-cadastrar-depois");

    // Mesmo padrão de com.example.malune.util.RegexPatterns (versão JS)
    const REGEX_CEP = /^[0-9]{5}[-]?[0-9]{3}$/;

    const campoCep = document.getElementById("cep");
    const campoRua = document.getElementById("rua");
    const campoBairro = document.getElementById("bairro");
    const campoNumero = document.getElementById("numero");
    const campoEstado = document.getElementById("estado");

    // Assim que o usuário mexe de novo no campo, tira o estado inválido
    // (senão o balão nativo fica "preso" mostrando o erro antigo)
    [campoCep, campoRua, campoBairro, campoNumero, campoEstado].forEach((campo) => {
        if (campo) {
            campo.addEventListener("input", () => campo.setCustomValidity(""));
            campo.addEventListener("change", () => campo.setCustomValidity(""));
        }
    });

    // Mesmas mensagens do EnderecoDTO, exibidas no balãozinho nativo do navegador
    // (setCustomValidity + reportValidity), igual foi feito no cadastro.js
    function validarEndereco() {
        campoCep.setCustomValidity(
            REGEX_CEP.test(campoCep.value.trim())
                ? ""
                : "CEP inválido."
        );

        campoRua.setCustomValidity(
            campoRua.value.trim() !== ""
                ? ""
                : "A rua é obrigatório."
        );

        campoBairro.setCustomValidity(
            campoBairro.value.trim() !== ""
                ? ""
                : "O bairro é obrigatório."
        );

        campoNumero.setCustomValidity(
            campoNumero.value.trim() !== "" && Number(campoNumero.value) > 0
                ? ""
                : "O número é obrigatório."
        );

        campoEstado.setCustomValidity(
            campoEstado.value.trim() !== ""
                ? ""
                : "O estado é obrigatório."
        );

        // Mostra o balão nativo no primeiro campo inválido (mesmo estilo do "campo obrigatório")
        return form.reportValidity();
    }

    function pegarUsuarioOuVoltar() {
        const usuario = JSON.parse(sessionStorage.getItem("usuarioCadastro"));

        if (!usuario) {
            alert("Os dados do usuário não foram encontrados.");
            window.location.href = "cadastro.html";
            return null;
        }

        return usuario;
    }

    async function enviarCadastro(corpo) {
        try {
            const resposta = await fetch("/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(corpo)
            });

            if (resposta.ok) {
                sessionStorage.removeItem("usuarioCadastro");
                alert("Cadastro realizado com sucesso!");
                window.location.href = "login.html";
            } else {
                const texto = await resposta.text();
                let mensagem = texto;

                try {
                    const corpo = JSON.parse(texto);
                    mensagem = corpo.error || corpo.message || texto;
                } catch (_) {
                    // Mantém a resposta textual quando ela não for JSON.
                }

                alert(mensagem || "Verifique os dados informados.");
            }
        } catch (e) {
            console.error(e);
            alert("Não foi possível conectar ao servidor. Tente novamente.");
        }
    }

    // -----------------------------
    // CADASTRAR DEPOIS
    // -----------------------------
    if (btnCadastrarDepois) {
        btnCadastrarDepois.addEventListener("click", async () => {
            const usuario = pegarUsuarioOuVoltar();
            if (!usuario) return;

            await enviarCadastro({
                usuario: usuario,
                cadastrarEndereco: false
            });
        });
    }

    // -----------------------------
    // CADASTRAR COM ENDEREÇO
    // -----------------------------
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const usuario = pegarUsuarioOuVoltar();
            if (!usuario) return;

            if (!validarEndereco()) {
                return;
            }

            const complemento = document.getElementById("complemento").value.trim();

            const endereco = {
                cep: campoCep.value.trim(),
                rua: campoRua.value.trim(),
                bairro: campoBairro.value.trim(),
                numero: Number(campoNumero.value),
                complemento: complemento === "" ? null : complemento,
                estado: campoEstado.value.trim()
            };

            await enviarCadastro({
                usuario: usuario,
                endereco: endereco,
                cadastrarEndereco: true
            });
        });
    }
});

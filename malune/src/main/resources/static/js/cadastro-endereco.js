document.addEventListener('DOMContentLoaded', () => {
    function mostrarPopup(mensagem, sucesso = false) {
        const popup = document.createElement('div');
        popup.className = `popup-cadastro ${sucesso ? 'sucesso' : 'erro'}`;
        popup.textContent = mensagem;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3500);
    }

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
            mostrarPopup("Os dados do usuário não foram encontrados.");
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
                mostrarPopup("Cadastro realizado com sucesso!", true);
                window.location.href = "login.html";
            } else {
                const erro = await resposta.text();
                mostrarPopup(erro || "Verifique os dados informados.");
            }
        } catch (e) {
            console.error(e);
            mostrarPopup("Não foi possível conectar ao servidor. Tente novamente.");
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

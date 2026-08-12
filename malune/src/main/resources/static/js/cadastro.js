document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('input[type="password"]').forEach((campo) => {
        const envoltorio = document.createElement('div');
        envoltorio.className = 'campo-senha';
        envoltorio.style.cssText = 'position:relative;width:100%;display:block;';
        campo.parentNode.insertBefore(envoltorio, campo);
        envoltorio.appendChild(campo);
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'botao-olho';
        botao.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);width:28px;height:28px;padding:0;border:0;background:transparent;display:grid;place-items:center;cursor:pointer;color:#777;z-index:2;';
        botao.setAttribute('aria-label', 'Mostrar senha');
        botao.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>';
        botao.addEventListener('click', () => {
            const visivel = campo.type === 'text';
            campo.type = visivel ? 'password' : 'text';
            botao.setAttribute('aria-label', visivel ? 'Mostrar senha' : 'Ocultar senha');
        });
        envoltorio.appendChild(botao);
    });

    // ==========================================
    // 1. LÓGICA DO MODAL DE ACESSIBILIDADE
    // ==========================================
    const btnAbrirA11y = document.getElementById('btn-abrir-a11y');
    const btnFecharA11y = document.getElementById('btn-fechar-a11y');
    const modalA11y = document.getElementById('modal-a11y');
    const btnRestaurar = document.getElementById('btn-restaurar');

    const toggleContraste = document.getElementById('toggle-contraste');
    const toggleTexto = document.getElementById('toggle-texto');
    const toggleDislexia = document.getElementById('toggle-dislexia');
    const toggleLinks = document.getElementById('toggle-links');

    // Abrir modal
    if (btnAbrirA11y && modalA11y) {
        btnAbrirA11y.addEventListener('click', () => {
            modalA11y.showModal();
        });
    }

    // Fechar modal no botão X
    if (btnFecharA11y && modalA11y) {
        btnFecharA11y.addEventListener('click', () => {
            modalA11y.close();
        });
    }

    // [PADRÃO DOS OUTROS ARQUIVOS] Fechar modal ao clicar fora dele
    if (modalA11y) {
        modalA11y.addEventListener('click', (event) => {
            const rect = modalA11y.getBoundingClientRect();
            if (
                event.clientX < rect.left ||
                event.clientY < rect.top ||
                event.clientX > rect.right ||
                event.clientY > rect.bottom
            ) {
                modalA11y.close();
            }
        });
    }

    // Função genérica para aplicar acessibilidade e salvar no localStorage
    function aplicarAcessibilidade(checkbox, nomeClasse, chaveStorage) {
        if (!checkbox) return; // Proteção extra

        // Carrega o estado salvo ao abrir a página
        if (localStorage.getItem(chaveStorage) === 'true') {
            checkbox.checked = true;
            document.body.classList.add(nomeClasse);
        }

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add(nomeClasse);
                localStorage.setItem(chaveStorage, 'true');
            } else {
                document.body.classList.remove(nomeClasse);
                localStorage.setItem(chaveStorage, 'false');
            }
        });
    }

    // Ligando os botões com as classes CSS e salvando
    aplicarAcessibilidade(toggleContraste, 'modo-alto-contraste', 'a11y_contraste');
    aplicarAcessibilidade(toggleTexto, 'modo-texto-grande', 'a11y_texto');
    aplicarAcessibilidade(toggleDislexia, 'modo-dislexia', 'a11y_dislexia');
    aplicarAcessibilidade(toggleLinks, 'modo-sublinhar', 'a11y_links');

    // Restaurar padrões (usando classList.remove para manter o padrão das outras telas)
    if (btnRestaurar) {
        btnRestaurar.addEventListener('click', () => {
            document.body.classList.remove('modo-alto-contraste', 'modo-texto-grande', 'modo-dislexia', 'modo-sublinhar');

            if (toggleContraste) toggleContraste.checked = false;
            if (toggleTexto) toggleTexto.checked = false;
            if (toggleDislexia) toggleDislexia.checked = false;
            if (toggleLinks) toggleLinks.checked = false;

            localStorage.clear();
        });
    }

    // ================================================
    // 2. LÓGICA DO FORMULÁRIO (ENVIO PARA O BACK-END)
    // ================================================

    // Mesmos padrões de com.example.malune.util.RegexPatterns (versão JS)
    const REGEX = {
        CPF: /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/,
        EMAIL: /^(?!.*[.\-]{2})[a-zA-Z0-9]+(?:[.\-+][a-zA-Z0-9]+)*@(?!.*[.\-]{2})[a-zA-Z0-9]+(?:[.\-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
        TELEFONE: /^(\([0-9]{2}\)|[0-9]{2})[\- ]?[0-9]{5}[.\- ]?[0-9]{4}$/,
        NOME_USUARIO: /^(?!.*[._\-]{2})[a-zA-Z0-9_](?:[a-zA-Z0-9_.\-]{0,28}[a-zA-Z0-9_])?$/,
        SENHA: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&_\-!+=?.,:;/|"'()\[\]{}^~])[a-zA-Z0-9@#$%&_\-!+=?.,:;/|"'()\[\]{}^~]{8,16}$/
    };

    const campoNome = document.getElementById("nome");
    const campoNomeUsuario = document.getElementById("nome_usuario");
    const campoEmail = document.getElementById("email");
    const campoCpf = document.getElementById("cpf");
    const campoTelefone = document.getElementById("telefone");
    const campoDataNascimento = document.getElementById("data_nascimento");
    const campoSenha = document.getElementById("senha");
    const campoConfirmarSenha = document.getElementById("confirmar_senha");

    // Assim que o usuário mexe de novo no campo, tira o estado inválido
    // (senão o balão nativo fica "preso" mostrando o erro antigo)
    [campoNome, campoNomeUsuario, campoEmail, campoCpf, campoTelefone,
        campoDataNascimento, campoSenha, campoConfirmarSenha].forEach((campo) => {
        if (campo) {
            campo.addEventListener("input", () => campo.setCustomValidity(""));
        }
    });

    // Mesmas mensagens do CadastroUsuarioDTO, mas exibidas no balãozinho nativo
    // do navegador (setCustomValidity + reportValidity), igual o aviso de campo vazio
    function validarUsuario() {
        campoCpf.setCustomValidity(
            REGEX.CPF.test(campoCpf.value.trim())
                ? ""
                : "CPF inválido. Informe o CPF com ou sem pontuação (ex: 12345678900 ou 123.456.789-00)."
        );

        campoEmail.setCustomValidity(
            REGEX.EMAIL.test(campoEmail.value.trim())
                ? ""
                : "E-mail inválido."
        );

        // Telefone é opcional no DTO (sem @NotBlank) — só valida o padrão se algo foi digitado
        const telefoneValor = campoTelefone.value.trim();
        campoTelefone.setCustomValidity(
            telefoneValor === "" || REGEX.TELEFONE.test(telefoneValor)
                ? ""
                : "Telefone inválido. Informe no formato (XX) 9XXXX-XXXX ou apenas números."
        );

        campoNomeUsuario.setCustomValidity(
            REGEX.NOME_USUARIO.test(campoNomeUsuario.value.trim())
                ? ""
                : "Nome de usuário inválido. Deve conter até 30 caracteres válidos."
        );

        campoSenha.setCustomValidity(
            REGEX.SENHA.test(campoSenha.value)
                ? ""
                : "A senha deve conter entre 8 e 16 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
        );

        campoDataNascimento.setCustomValidity(
            campoDataNascimento.value && new Date(campoDataNascimento.value) < new Date()
                ? ""
                : "A data de nascimento deve ser uma data no passado."
        );

        campoConfirmarSenha.setCustomValidity(
            campoConfirmarSenha.value === campoSenha.value
                ? ""
                : "As senhas não coincidem."
        );

        // Mostra o balão nativo no primeiro campo inválido (mesmo estilo do "campo obrigatório")
        return formCadastro.reportValidity();
    }

    const formCadastro = document.getElementById("form-cadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!validarUsuario()) {
                return;
            }

            const telefone = campoTelefone.value.trim();

            const usuario = {
                nomeCompleto: campoNome.value.trim(),
                nomeUsuario: campoNomeUsuario.value.trim(),
                email: campoEmail.value.trim(),
                cpf: campoCpf.value.trim(),
                // campo opcional no banco: manda null em vez de "" quando vazio,
                // senão o @Pattern do back-end rejeita a string vazia
                numeroTelefone: telefone === "" ? null : telefone,
                dataNascimento: campoDataNascimento.value,
                senha: campoSenha.value
            };

            // Mesma chave que a etapa 2 (cadastro-endereco.js) espera encontrar
            sessionStorage.setItem("usuarioCadastro", JSON.stringify(usuario));

            window.location.href = "cadastro-endereco.html";
        });
    }
});

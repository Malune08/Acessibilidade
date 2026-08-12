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

    const IDADE_MINIMA = 16;

    function idadeMinimaValida(valor) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            return false;
        }

        const [ano, mes, dia] = valor.split('-').map(Number);
        const nascimento = new Date(ano, mes - 1, dia);

        if (
            nascimento.getFullYear() !== ano ||
            nascimento.getMonth() !== mes - 1 ||
            nascimento.getDate() !== dia
        ) {
            return false;
        }

        const hoje = new Date();
        const dataLimite = new Date(
            hoje.getFullYear() - IDADE_MINIMA,
            hoje.getMonth(),
            hoje.getDate()
        );

        return nascimento <= dataLimite;
    }

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
            idadeMinimaValida(campoDataNascimento.value)
                ? ""
                : `É necessário ter pelo menos ${IDADE_MINIMA} anos para se cadastrar.`
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

document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // POPUPS / NOTIFICAÇÕES
    // ================================================

    function mostrarPopup(mensagem, sucesso = false) {
        // Evita vários popups ao mesmo tempo
        const popupAnterior = document.querySelector('.popup-cadastro');
        if (popupAnterior) {
            popupAnterior.remove();
        }

        const popup = document.createElement('div');
        popup.className = `popup-cadastro ${sucesso ? 'sucesso' : 'erro'}`;
        popup.setAttribute('role', sucesso ? 'status' : 'alert');
        popup.setAttribute('aria-live', sucesso ? 'polite' : 'assertive');

        // Ícone
        const icone = document.createElement('div');
        icone.className = 'popup-icone';
        icone.textContent = sucesso ? '✓' : '!';

        // Conteúdo
        const conteudo = document.createElement('div');
        conteudo.className = 'popup-texto';

        const titulo = document.createElement('strong');
        titulo.textContent = sucesso ? 'Cadastro realizado!' : 'Não foi possível continuar';

        const descricao = document.createElement('span');
        descricao.textContent = mensagem;

        conteudo.appendChild(titulo);
        conteudo.appendChild(descricao);

        popup.appendChild(icone);
        popup.appendChild(conteudo);

        document.body.appendChild(popup);

        // Força a animação de entrada
        requestAnimationFrame(() => {
            popup.classList.add('mostrar');
        });

        // Erros ficam um pouco mais de tempo na tela
        if (!sucesso) {
            setTimeout(() => {
                popup.classList.remove('mostrar');
                setTimeout(() => {
                    popup.remove();
                }, 250);
            }, 3500);
        }

        return popup;
    }

    // ================================================
    // CAMPOS
    // ================================================

    const form = document.getElementById('form-endereco');
    const btnCadastrarDepois = document.getElementById('btn-cadastrar-depois');
    const campoCep = document.getElementById('cep');
    const campoRua = document.getElementById('rua');
    const campoBairro = document.getElementById('bairro');
    const campoNumero = document.getElementById('numero');
    const campoEstado = document.getElementById('estado');

    const REGEX_CEP = /^[0-9]{5}[-]?[0-9]{3}$/;

    // ================================================
    // LIMPA ERROS DOS CAMPOS
    // ================================================

    [campoCep, campoRua, campoBairro, campoNumero, campoEstado].forEach((campo) => {
        if (!campo) return;

        const limparValidacao = () => {
            campo.setCustomValidity('');
            campo.setAttribute('aria-invalid', String(!campo.checkValidity()));
        };

        campo.addEventListener('input', limparValidacao);
        campo.addEventListener('change', limparValidacao);
    });

    // ================================================
    // VALIDAÇÃO DO ENDEREÇO
    // ================================================

    function validarEndereco() {
        campoCep.setCustomValidity(REGEX_CEP.test(campoCep.value.trim()) ? '' : 'CEP inválido.');
        campoRua.setCustomValidity(campoRua.value.trim() !== '' ? '' : 'A rua é obrigatória.');
        campoBairro.setCustomValidity(campoBairro.value.trim() !== '' ? '' : 'O bairro é obrigatório.');
        campoNumero.setCustomValidity(
            campoNumero.value.trim() !== '' && Number(campoNumero.value) > 0
                ? ''
                : 'O número é obrigatório.'
        );
        campoEstado.setCustomValidity(campoEstado.value.trim() !== '' ? '' : 'O estado é obrigatório.');

        [campoCep, campoRua, campoBairro, campoNumero, campoEstado].forEach((campo) => {
            campo.setAttribute('aria-invalid', String(!campo.checkValidity()));
        });

        return form.reportValidity();
    }

    // ================================================
    // RECUPERA O USUÁRIO DA ETAPA 1
    // ================================================

    function pegarUsuarioOuVoltar() {
        try {
            const usuario = JSON.parse(sessionStorage.getItem('usuarioCadastro'));

            if (!usuario) {
                mostrarPopup('Os dados do usuário não foram encontrados.');
                setTimeout(() => {
                    window.location.href = 'cadastro.html';
                }, 1500);
                return null;
            }

            return usuario;
        } catch (erro) {
            console.error('Erro ao recuperar os dados do cadastro:', erro);
            mostrarPopup('Os dados do cadastro estão inválidos.');
            setTimeout(() => {
                window.location.href = 'cadastro.html';
            }, 1500);
            return null;
        }
    }

    // ================================================
    // ENVIA O CADASTRO PARA O BACKEND
    // ================================================

    async function enviarCadastro(corpo) {
        try {
            const resposta = await fetch('/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(corpo)
            });

            const texto = await resposta.text();
            let resultado = {};

            try {
                resultado = texto ? JSON.parse(texto) : {};
            } catch (_) {
                // Mantém resposta textual quando não for JSON
            }

            // ERRO DO BACKEND
            if (!resposta.ok) {
                const mensagem = resultado.error || resultado.message || texto;
                mostrarPopup(mensagem || 'Verifique os dados informados.');
                return;
            }

            // CADASTRO SEM ID
            if (!resultado.id) {
                mostrarPopup('Cadastro realizado, mas não foi possível identificar o usuário.');
                return;
            }

            // CADASTRO REALIZADO COM SUCESSO
            localStorage.setItem('id_usuario', String(resultado.id));
            localStorage.setItem('tipo_usuario', resultado.tipo || 'USUARIO');
            localStorage.setItem('endereco_pendente', String(!corpo.cadastrarEndereco));
            sessionStorage.removeItem('usuarioCadastro');

            mostrarPopup('Sua conta foi criada com sucesso.', true);

            setTimeout(() => {
                window.location.href = 'produtos.html';
            }, 1500);

        } catch (erro) {
            console.error(erro);
            mostrarPopup('Não foi possível conectar ao servidor. Tente novamente.');
        }
    }

    // ================================================
    // CADASTRAR SEM ENDEREÇO
    // ================================================

    if (btnCadastrarDepois) {
        btnCadastrarDepois.addEventListener('click', async () => {
            const usuario = pegarUsuarioOuVoltar();
            if (!usuario) return;

            await enviarCadastro({
                usuario,
                cadastrarEndereco: false
            });
        });
    }

    // ================================================
    // CADASTRAR COM ENDEREÇO
    // ================================================

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usuario = pegarUsuarioOuVoltar();
            if (!usuario || !validarEndereco()) return;

            const complemento = document.getElementById('complemento').value.trim();

            const endereco = {
                cep: campoCep.value.trim(),
                rua: campoRua.value.trim(),
                bairro: campoBairro.value.trim(),
                numero: Number(campoNumero.value),
                complemento: complemento === '' ? null : complemento,
                estado: campoEstado.value.trim()
            };

            await enviarCadastro({
                usuario,
                endereco,
                cadastrarEndereco: true
            });
        });
    }
});
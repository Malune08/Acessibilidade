document.addEventListener('DOMContentLoaded', () => {
    function mostrarPopup(mensagem, sucesso = false) {
        const popup = document.createElement('div');
        popup.className = `popup-cadastro ${sucesso ? 'sucesso' : 'erro'}`;
        popup.textContent = mensagem;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3500);
    }

    const form = document.getElementById('form-endereco');
    const btnCadastrarDepois = document.getElementById('btn-cadastrar-depois');
    const campoCep = document.getElementById('cep');
    const campoRua = document.getElementById('rua');
    const campoBairro = document.getElementById('bairro');
    const campoNumero = document.getElementById('numero');
    const campoEstado = document.getElementById('estado');
    const REGEX_CEP = /^[0-9]{5}[-]?[0-9]{3}$/;

    [campoCep, campoRua, campoBairro, campoNumero, campoEstado].forEach((campo) => {
        if (campo) {
            campo.addEventListener('input', () => campo.setCustomValidity(''));
            campo.addEventListener('change', () => campo.setCustomValidity(''));
        }
    });

    function validarEndereco() {
        campoCep.setCustomValidity(
            REGEX_CEP.test(campoCep.value.trim()) ? '' : 'CEP invalido.'
        );
        campoRua.setCustomValidity(
            campoRua.value.trim() !== '' ? '' : 'A rua e obrigatoria.'
        );
        campoBairro.setCustomValidity(
            campoBairro.value.trim() !== '' ? '' : 'O bairro e obrigatorio.'
        );
        campoNumero.setCustomValidity(
            campoNumero.value.trim() !== '' && Number(campoNumero.value) > 0
                ? ''
                : 'O numero e obrigatorio.'
        );
        campoEstado.setCustomValidity(
            campoEstado.value.trim() !== '' ? '' : 'O estado e obrigatorio.'
        );

        return form.reportValidity();
    }

    function pegarUsuarioOuVoltar() {
        try {
            const usuario = JSON.parse(sessionStorage.getItem('usuarioCadastro'));

            if (!usuario) {
                mostrarPopup('Os dados do usuario nao foram encontrados.');
                window.location.href = 'cadastro.html';
                return null;
            }

            return usuario;
        } catch (erro) {
            console.error('Erro ao recuperar os dados do cadastro:', erro);
            mostrarPopup('Os dados do cadastro estao invalidos.');
            window.location.href = 'cadastro.html';
            return null;
        }
    }

    async function enviarCadastro(corpo) {
        try {
            const resposta = await fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(corpo)
            });

            const texto = await resposta.text();
            let resultado = {};

            try {
                resultado = texto ? JSON.parse(texto) : {};
            } catch (_) {
                // Mantem a resposta textual quando ela nao for JSON.
            }

            if (!resposta.ok) {
                const mensagem = resultado.error || resultado.message || texto;
                mostrarPopup(mensagem || 'Verifique os dados informados.');
                return;
            }

            if (!resultado.id) {
                mostrarPopup('Cadastro realizado, mas nao foi possivel identificar o usuario.');
                return;
            }

            localStorage.setItem('id_usuario', String(resultado.id));
            localStorage.setItem('tipo_usuario', resultado.tipo || 'USUARIO');
            localStorage.setItem('endereco_pendente', String(!corpo.cadastrarEndereco));
            sessionStorage.removeItem('usuarioCadastro');

            window.location.href = 'produtos.html';
        } catch (erro) {
            console.error(erro);
            mostrarPopup('Nao foi possivel conectar ao servidor. Tente novamente.');
        }
    }

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

document.addEventListener('DOMContentLoaded', () => {
    const formEndereco = document.getElementById('form-endereco');
    const campoCep = document.getElementById('cep');
    const campoEstado = document.getElementById('estado');
    const campoRua = document.getElementById('rua');
    const campoBairro = document.getElementById('bairro');
    const campoNumero = document.getElementById('numero');
    const campoComplemento = document.getElementById('complemento');
    const mensagemEndereco = document.getElementById('mensagem-endereco');

    function formatarCep(valor) {
        return valor
            .replace(/\D/g, '')
            .slice(0, 8)
            .replace(/^(\d{5})(\d)/, '$1-$2');
    }

    function limparErros() {
        mensagemEndereco.textContent = '';

        document
            .querySelectorAll('.campo-invalido')
            .forEach((campo) => {
                campo.classList.remove('campo-invalido');
            });
    }

    function mostrarErro(mensagem, campos) {
        mensagemEndereco.textContent = mensagem;

        campos.forEach((campo) => {
            campo.classList.add('campo-invalido');
        });
    }

    function validarCep(cep) {
        const regexCep = /^\d{5}-?\d{3}$/;
        return regexCep.test(cep);
    }

    function validarNumero(numero) {
        const regexNumero = /^\d{1,6}$/;
        return regexNumero.test(numero);
    }

    function validarFormulario() {
        const camposObrigatorios = [
            campoCep,
            campoEstado,
            campoRua,
            campoBairro,
            campoNumero
        ];

        const camposVazios = camposObrigatorios.filter((campo) => {
            return campo.value.trim() === '';
        });

        const camposInvalidos = [...camposVazios];

        if (campoCep.value.trim() !== '' && !validarCep(campoCep.value.trim())) {
            if (!camposInvalidos.includes(campoCep)) {
                camposInvalidos.push(campoCep);
            }
        }

        if (campoNumero.value.trim() !== '' && !validarNumero(campoNumero.value.trim())) {
            if (!camposInvalidos.includes(campoNumero)) {
                camposInvalidos.push(campoNumero);
            }
        }

        if (camposInvalidos.length > 0) {
            mostrarErro(
                'Preencha corretamente os campos obrigatórios.',
                camposInvalidos
            );

            camposInvalidos[0].focus();

            return false;
        }

        return true;
    }

    async function buscarCep() {
        const cep = campoCep.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            return;
        }

        campoRua.disabled = true;
        campoBairro.disabled = true;
        campoEstado.disabled = true;

        try {
            const resposta = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );

            if (!resposta.ok) {
                throw new Error('Não foi possível consultar o CEP.');
            }

            const endereco = await resposta.json();

            if (endereco.erro) {
                throw new Error('CEP não encontrado.');
            }

            campoRua.value = endereco.logradouro || '';
            campoBairro.value = endereco.bairro || '';

            const siglasUfParaNome = {
                AC: 'Acre',
                AL: 'Alagoas',
                AP: 'Amapá',
                AM: 'Amazonas',
                BA: 'Bahia',
                CE: 'Ceará',
                DF: 'Distrito Federal',
                ES: 'Espírito Santo',
                GO: 'Goiás',
                MA: 'Maranhão',
                MT: 'Mato Grosso',
                MS: 'Mato Grosso do Sul',
                MG: 'Minas Gerais',
                PA: 'Pará',
                PB: 'Paraíba',
                PR: 'Paraná',
                PE: 'Pernambuco',
                PI: 'Piauí',
                RJ: 'Rio de Janeiro',
                RN: 'Rio Grande do Norte',
                RS: 'Rio Grande do Sul',
                RO: 'Rondônia',
                RR: 'Roraima',
                SC: 'Santa Catarina',
                SP: 'São Paulo',
                SE: 'Sergipe',
                TO: 'Tocantins'
            };

            const nomeEstado = siglasUfParaNome[endereco.uf];

            if (nomeEstado) {
                campoEstado.value = nomeEstado;
            }
        } catch (erro) {
            mostrarErro(erro.message, [campoCep]);
        } finally {
            campoRua.disabled = false;
            campoBairro.disabled = false;
            campoEstado.disabled = false;
        }
    }

    campoCep.addEventListener('input', () => {
        campoCep.value = formatarCep(campoCep.value);
        limparErros();
    });

    campoCep.addEventListener('blur', buscarCep);

    campoNumero.addEventListener('input', () => {
        campoNumero.value = campoNumero.value.replace(/\D/g, '');
        limparErros();
    });

    formEndereco.addEventListener('submit', (event) => {
        event.preventDefault();
        limparErros();

        if (!validarFormulario()) {
            return;
        }

        const endereco = {
            cep: campoCep.value.trim(),
            estado: campoEstado.value.trim(),
            rua: campoRua.value.trim(),
            bairro: campoBairro.value.trim(),
            numero: parseInt(campoNumero.value.trim(), 10),
            complemento: campoComplemento.value.trim()
        };

        localStorage.setItem(
            'endereco_dados',
            JSON.stringify(endereco)
        );

        window.location.href = 'pagamento.html';
    });
});
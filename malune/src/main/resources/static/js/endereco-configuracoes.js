document.addEventListener('DOMContentLoaded', () => {
    const estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];
    const formulario = document.getElementById('form-endereco-configuracoes');
    const mensagem = document.getElementById('mensagem-endereco-configuracoes');
    const campoCep = document.getElementById('cep');
    const campoEstado = document.getElementById('estado');
    const idUsuario = localStorage.getItem('id_usuario');

    estados.forEach((estado) => {
        const opcao = document.createElement('option');
        opcao.value = estado;
        opcao.textContent = estado;
        campoEstado.appendChild(opcao);
    });

    function mostrarMensagem(texto, erro = false) {
        mensagem.textContent = texto;
        mensagem.style.color = erro ? '#bd285e' : '#3d7b15';
    }

    function formatarCep(valor) {
        return valor.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
    }

    function preencherEndereco(endereco) {
        campoCep.value = formatarCep(endereco.cep || '');
        campoEstado.value = endereco.estado?.estado || '';
        document.getElementById('rua').value = endereco.rua || '';
        document.getElementById('bairro').value = endereco.bairro || '';
        document.getElementById('numero').value = endereco.numero ?? '';
        document.getElementById('complemento').value = endereco.complemento || '';
    }

    async function carregarEndereco() {
        if (!idUsuario) {
            mostrarMensagem('Faça login novamente para acessar seu endereço.', true);
            return;
        }

        try {
            const resposta = await fetch(`/endereco/${idUsuario}`);
            if (resposta.status === 204) {
                return;
            }
            if (!resposta.ok) {
                throw new Error('Não foi possível carregar o endereço.');
            }
            preencherEndereco(await resposta.json());
        } catch (erro) {
            mostrarMensagem(erro.message, true);
        }
    }

    campoCep.addEventListener('input', () => {
        campoCep.value = formatarCep(campoCep.value);
    });

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        if (!idUsuario) {
            mostrarMensagem('Faça login novamente para salvar seu endereço.', true);
            return;
        }

        const dados = Object.fromEntries(new FormData(formulario));
        dados.numero = Number(dados.numero);

        try {
            const resposta = await fetch(`/endereco/${idUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!resposta.ok) {
                throw new Error(await resposta.text() || 'Não foi possível salvar o endereço.');
            }
            preencherEndereco(await resposta.json());
            mostrarMensagem('Endereço salvo com sucesso.');
        } catch (erro) {
            mostrarMensagem(erro.message, true);
        }
    });

    carregarEndereco();
});

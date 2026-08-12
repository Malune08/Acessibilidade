document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-perfil');
    const mensagem = document.getElementById('mensagem-perfil');
    const idUsuario = localStorage.getItem('id_usuario');
    const campos = ['nome', 'email', 'cpf', 'telefone'];

    function mostrarMensagem(texto, erro = false) {
        mensagem.textContent = texto;
        mensagem.style.color = erro ? '#bd285e' : '#3d7b15';
    }

    function preencherPerfil(perfil) {
        campos.forEach((campo) => {
            document.getElementById(campo).value = perfil[campo] ?? '';
        });
    }

    async function carregarPerfil() {
        if (!idUsuario) {
            mostrarMensagem('Faça login novamente para acessar seu perfil.', true);
            return;
        }

        try {
            const resposta = await fetch(`/perfil/${idUsuario}`);
            if (!resposta.ok) {
                throw new Error('Não foi possível carregar seus dados.');
            }
            preencherPerfil(await resposta.json());
        } catch (erro) {
            mostrarMensagem(erro.message, true);
        }
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        if (!idUsuario) {
            mostrarMensagem('Faça login novamente para salvar seu perfil.', true);
            return;
        }

        const dados = Object.fromEntries(new FormData(formulario));

        try {
            const resposta = await fetch(`/perfil/${idUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!resposta.ok) {
                throw new Error(await resposta.text() || 'Não foi possível salvar os dados.');
            }

            preencherPerfil(await resposta.json());
            mostrarMensagem('Dados salvos com sucesso.');
        } catch (erro) {
            mostrarMensagem(erro.message, true);
        }
    });

    carregarPerfil();
});

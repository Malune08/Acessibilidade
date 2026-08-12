document.addEventListener('DOMContentLoaded', () => {
    function configurarAlternarSenha(idCampo, idBotao, texto) {
        const campo = document.getElementById(idCampo);
        const botao = document.getElementById(idBotao);

        if (!campo || !botao) {
            return;
        }

        botao.addEventListener('click', () => {
            const senhaVisivel = campo.type === 'text';
            campo.type = senhaVisivel ? 'password' : 'text';
            botao.setAttribute('aria-label', senhaVisivel ? `Mostrar ${texto}` : `Ocultar ${texto}`);
            botao.setAttribute('aria-pressed', String(!senhaVisivel));
        });
    }

    configurarAlternarSenha('novaSenha', 'mostrar-nova-senha', 'nova senha');
    configurarAlternarSenha('confirmarSenha', 'mostrar-confirmar-senha', 'confirmação de senha');

    // lógica do baack
    document
        .getElementById('formNovaSenha')
        .addEventListener('submit', async (event) => {

            event.preventDefault();

            const email =
                sessionStorage.getItem(
                    'email_recuperacao'
                );

            const token =
                sessionStorage.getItem(
                    'token_recuperacao'
                );

            const novaSenha =
                document.getElementById('novaSenha').value;

            const confirmarSenha =
                document.getElementById('confirmarSenha').value;

            const response = await fetch(
                '/recuperacao-senha/alterar',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        token: token,
                        novaSenha: novaSenha,
                        confirmarSenha: confirmarSenha
                    })
                }
            );

            const mensagem = await response.text();

            if (!response.ok) {
                alert(mensagem);
                return;
            }

            sessionStorage.removeItem(
                'email_recuperacao'
            );

            sessionStorage.removeItem(
                'token_recuperacao'
            );

            alert('Senha alterada com sucesso.');

            window.location.href = '/login.html';
        });
});

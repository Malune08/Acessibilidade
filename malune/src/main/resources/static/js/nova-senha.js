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

    // =====================================
    // POPUP DE SUCESSO
    // =====================================

    const popupSucesso = document.getElementById('popup-sucesso');
    const btnPopupLogin = document.getElementById('btn-popup-login');


    if (btnPopupLogin) {
        btnPopupLogin.addEventListener('click', () => {
            if (popupSucesso) {
                popupSucesso.close();
            }
            window.location.href = '/login.html';
        });
    }


    // =====================================
    // ALTERAÇÃO DE SENHA
    // =====================================

    const formNovaSenha = document.getElementById('formNovaSenha');

    if (!formNovaSenha) {
        return;
    }

    formNovaSenha.addEventListener('submit', async (event) => {

            event.preventDefault();

            const email = sessionStorage.getItem('email_recuperacao');
            const token = sessionStorage.getItem('token_recuperacao');
            const novaSenha = document.getElementById('novaSenha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

            try {
                const response = await fetch(
                    '/recuperacao-senha/alterar',
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            email: email,
                            token: token,
                            novaSenha: novaSenha,
                            confirmarSenha:
                            confirmarSenha
                        })
                    }
                );

                const mensagem = await response.text();

                // ERRO
                if (!response.ok) {
                    alert(mensagem);
                    return;
                }

                // SUCESSO
                sessionStorage.removeItem('email_recuperacao');
                sessionStorage.removeItem('token_recuperacao');


                // Abre o popup personalizado
                if (popupSucesso) {
                    popupSucesso.showModal();
                }
            } catch (erro) {
                console.error('Erro ao alterar senha:', erro);
                alert('Não foi possível alterar a senha. Tente novamente.');
            }
        }
    );
});
document.addEventListener('DOMContentLoaded', () => {
    const campoSenha = document.getElementById('senha');
    const botaoAlternarSenha = document.getElementById('alternar-senha');

    // ==========================================
    // 2. LÓGICA DE LOGIN
    // ==========================================
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault();

            const identificadorInput = document.getElementById('identificador');
            const senhaInput = document.getElementById('senha');
            const loginError = document.getElementById('login-error');
            const submitButton = formLogin.querySelector('button[type="submit"]');

            if (loginError) {
                loginError.hidden = true;
                loginError.textContent = '';
            }

            const value = identificadorInput ? identificadorInput.value.trim() : '';
            const senha = senhaInput ? senhaInput.value : '';

            if (!value || !senha) {
                exibirErro('Informe o e-mail/usuário e a senha.');
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Entrando...';
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        identificador: value,
                        senha: senha
                    })
                });

                const resultado = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(resultado.message || resultado.error || 'E-mail/usuário ou senha inválidos.');
                }

                // Armazena dados de sessão básicos
                localStorage.setItem('id_usuario', resultado.id);
                localStorage.setItem('tipo_usuario', resultado.tipo);

                // Redirecionamento por Perfil
                if (resultado.tipo === 'ADMINISTRADOR') {
                    sessionStorage.setItem('malune_admin_token', resultado.token);
                    window.location.href = 'area-restrita.html';
                } else if (resultado.tipo === 'USUARIO') {
                    sessionStorage.removeItem('malune_admin_token');
                    window.location.href = 'produtos.html';
                } else {
                    throw new Error('Tipo de usuário não reconhecido pelo sistema.');
                }

            } catch (erro) {
                console.error('Erro ao tentar fazer login:', erro);
                exibirErro(erro.message || 'Não foi possível conectar ao servidor.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Continuar';
                }
            }
        });
    }

    function exibirErro(mensagem) {
        const loginError = document.getElementById('login-error');
        if (loginError) {
            loginError.textContent = mensagem;
            loginError.hidden = false;
        } else {
            alert(mensagem);
        }
    }
});

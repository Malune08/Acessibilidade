document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. GERENCIAMENTO DE ACESSIBILIDADE (MODAL)
    // ==========================================
    const modalA11y = document.getElementById('modal-a11y');
    const btnAbrirA11y = document.getElementById('btn-abrir-a11y');
    const btnFecharA11y = document.getElementById('btn-fechar-a11y');
    const btnRestaurar = document.getElementById('btn-restaurar');

    const toggleContraste = document.getElementById('toggle-contraste');
    const toggleTexto = document.getElementById('toggle-texto');
    const toggleDislexia = document.getElementById('toggle-dislexia');
    const toggleLinks = document.getElementById('toggle-links');

    if (btnAbrirA11y && modalA11y) {
        btnAbrirA11y.addEventListener('click', () => {
            if (typeof modalA11y.showModal === 'function') {
                modalA11y.showModal();
            } else {
                alert('Seu navegador não suporta recursos de diálogo.');
            }
        });
    }

    if (btnFecharA11y && modalA11y) {
        btnFecharA11y.addEventListener('click', () => {
            modalA11y.close();
        });
    }

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

    if (toggleContraste) {
        toggleContraste.addEventListener('change', () => {
            document.body.classList.toggle('modo-alto-contraste', toggleContraste.checked);
            localStorage.setItem('a11y_contraste', toggleContraste.checked);
        });
    }

    if (toggleTexto) {
        toggleTexto.addEventListener('change', () => {
            document.body.classList.toggle('modo-texto-grande', toggleTexto.checked);
            localStorage.setItem('a11y_texto', toggleTexto.checked);
        });
    }

    if (toggleDislexia) {
        toggleDislexia.addEventListener('change', () => {
            document.body.classList.toggle('modo-dislexia', toggleDislexia.checked);
            localStorage.setItem('a11y_dislexia', toggleDislexia.checked);
        });
    }

    if (toggleLinks) {
        toggleLinks.addEventListener('change', () => {
            document.body.classList.toggle('modo-sublinhar', toggleLinks.checked);
            localStorage.setItem('a11y_links', toggleLinks.checked);
        });
    }

    if (btnRestaurar) {
        btnRestaurar.addEventListener('click', () => {
            document.body.classList.remove(
                'modo-alto-contraste',
                'modo-texto-grande',
                'modo-dislexia',
                'modo-sublinhar'
            );

            if (toggleContraste) toggleContraste.checked = false;
            if (toggleTexto) toggleTexto.checked = false;
            if (toggleDislexia) toggleDislexia.checked = false;
            if (toggleLinks) toggleLinks.checked = false;

            localStorage.removeItem('a11y_contraste');
            localStorage.removeItem('a11y_texto');
            localStorage.removeItem('a11y_dislexia');
            localStorage.removeItem('a11y_links');
        });
    }

    if (localStorage.getItem('a11y_contraste') === 'true' && toggleContraste) {
        toggleContraste.checked = true;
        document.body.classList.add('modo-alto-contraste');
    }

    if (localStorage.getItem('a11y_texto') === 'true' && toggleTexto) {
        toggleTexto.checked = true;
        document.body.classList.add('modo-texto-grande');
    }

    if (localStorage.getItem('a11y_dislexia') === 'true' && toggleDislexia) {
        toggleDislexia.checked = true;
        document.body.classList.add('modo-dislexia');
    }

    if (localStorage.getItem('a11y_links') === 'true' && toggleLinks) {
        toggleLinks.checked = true;
        document.body.classList.add('modo-sublinhar');
    }

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
                    window.location.href = 'principal-adm.html';
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
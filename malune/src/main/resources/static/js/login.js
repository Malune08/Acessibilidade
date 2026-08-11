document.addEventListener('DOMContentLoaded', () => {
    const modalA11y = document.getElementById('modal-a11y');
    const btnAbrirA11y = document.getElementById('btn-abrir-a11y');
    const btnFecharA11y = document.getElementById('btn-fechar-a11y');
    const btnRestaurar = document.getElementById('btn-restaurar');
    const toggles = [
        ['toggle-contraste', 'modo-alto-contraste', 'a11y_contraste'],
        ['toggle-texto', 'modo-texto-grande', 'a11y_texto'],
        ['toggle-dislexia', 'modo-dislexia', 'a11y_dislexia'],
        ['toggle-links', 'modo-sublinhar', 'a11y_links']
    ];

    if (btnAbrirA11y && modalA11y) {
        btnAbrirA11y.addEventListener('click', () => modalA11y.showModal());
    }

    if (btnFecharA11y && modalA11y) {
        btnFecharA11y.addEventListener('click', () => modalA11y.close());
    }

    if (modalA11y) {
        modalA11y.addEventListener('click', (event) => {
            const rect = modalA11y.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientY < rect.top ||
                event.clientX > rect.right || event.clientY > rect.bottom) {
                modalA11y.close();
            }
        });
    }

    toggles.forEach(([id, className, storageKey]) => {
        const toggle = document.getElementById(id);
        if (!toggle) return;

        toggle.checked = localStorage.getItem(storageKey) === 'true';
        document.body.classList.toggle(className, toggle.checked);
        toggle.addEventListener('change', () => {
            document.body.classList.toggle(className, toggle.checked);
            localStorage.setItem(storageKey, String(toggle.checked));
        });
    });

    if (btnRestaurar) {
        btnRestaurar.addEventListener('click', () => {
            toggles.forEach(([id, className, storageKey]) => {
                const toggle = document.getElementById(id);
                if (toggle) toggle.checked = false;
                document.body.classList.remove(className);
                localStorage.removeItem(storageKey);
            });
        });
    }

    const formLogin = document.getElementById('form-login');
    const identificador = document.getElementById('identificador');
    const senha = document.getElementById('senha');
    const loginError = document.getElementById('login-error');
    const submitButton = formLogin?.querySelector('button[type="submit"]');

    function showLoginError(message) {
        if (!loginError) return;
        loginError.textContent = message;
        loginError.hidden = false;
    }

    function clearLoginError() {
        if (!loginError) return;
        loginError.textContent = '';
        loginError.hidden = true;
    }

    if (formLogin) {
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearLoginError();

            const value = identificador.value.trim();
            if (!value || !senha.value) {
                showLoginError('Informe o e-mail/usuário e a senha.');
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Entrando...';
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        identificador: value,
                        senha: senha.value
                    })
                });
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.error || 'E-mail/usuário ou senha inválidos.');
                }

                if (data.tipo === 'ADMINISTRADOR' && data.token) {
                    sessionStorage.setItem('malune_admin_token', data.token);
                    sessionStorage.setItem('malune_admin', JSON.stringify({
                        id: data.id,
                        nomeUsuario: data.nomeUsuario,
                        email: data.email
                    }));
                    window.location.assign('/principal-adm.html');
                    return;
                }

                if (data.tipo === 'USUARIO') {
                    sessionStorage.removeItem('malune_admin_token');
                    sessionStorage.removeItem('malune_admin');
                    window.location.assign('/produtos.html');
                    return;
                }

                throw new Error('Resposta de login inválida.');
            } catch (error) {
                console.error('Erro ao tentar fazer login:', error);
                showLoginError(error.message || 'Não foi possível conectar ao servidor.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Continuar';
                }
            }
        });
    }
});

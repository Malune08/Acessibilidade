document.addEventListener('DOMContentLoaded', () => {
    const TOKEN_KEY = 'malune_admin_token';
    const ADMIN_KEY = 'malune_admin';
    const form = document.getElementById('form-login-adm');
    const usernameOrEmail = document.getElementById('usernameOrEmail');
    const senha = document.getElementById('senha');
    const button = document.getElementById('btn-login-adm');
    const error = document.getElementById('login-error');

    function showError(message) {
        if (!error) return;
        error.textContent = message;
        error.hidden = false;
    }

    function clearError() {
        if (!error) return;
        error.textContent = '';
        error.hidden = true;
    }

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearError();

            const identifier = usernameOrEmail.value.trim();
            const password = senha.value;
            if (!identifier || !password) {
                showError('Informe o usuário/e-mail e a senha.');
                return;
            }

            button.disabled = true;
            button.textContent = 'Entrando...';

            try {
                const response = await fetch('/admin/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernameOrEmail: identifier, senha: password })
                });
                const data = await response.json().catch(() => ({}));

                if (!response.ok || !data.token) {
                    throw new Error(data.error || 'Usuário ou senha inválidos.');
                }

                sessionStorage.setItem(TOKEN_KEY, data.token);
                sessionStorage.setItem(ADMIN_KEY, JSON.stringify({
                    id: data.id,
                    nomeUsuario: data.nomeUsuario,
                    email: data.email
                }));
                window.location.assign('principal-adm.html');
            } catch (requestError) {
                showError(requestError.message || 'Não foi possível realizar o login.');
            } finally {
                button.disabled = false;
                button.textContent = 'Entrar';
            }
        });
    }

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
});

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

    const modalA11y =
        document.getElementById('modal-a11y');

    const btnAbrirA11y =
        document.getElementById('btn-abrir-a11y');

    const btnFecharA11y =
        document.getElementById('btn-fechar-a11y');

    const btnRestaurar =
        document.getElementById('btn-restaurar');

    const toggleContraste =
        document.getElementById('toggle-contraste');

    const toggleTexto =
        document.getElementById('toggle-texto');

    const toggleDislexia =
        document.getElementById('toggle-dislexia');

    const toggleLinks =
        document.getElementById('toggle-links');

    // Abrir modal de acessibilidade
    if (btnAbrirA11y && modalA11y) {
        btnAbrirA11y.addEventListener('click', () => {
            if (
                typeof modalA11y.showModal ===
                'function'
            ) {
                modalA11y.showModal();
            } else {
                alert(
                    'Seu navegador não suporta recursos de diálogo.'
                );
            }
        });
    }

    // Fechar modal pelo botão X
    if (btnFecharA11y && modalA11y) {
        btnFecharA11y.addEventListener('click', () => {
            modalA11y.close();
        });
    }

    // Fechar modal ao clicar fora
    if (modalA11y) {
        modalA11y.addEventListener(
            'click',
            (event) => {
                const rect =
                    modalA11y.getBoundingClientRect();

                if (
                    event.clientX < rect.left ||
                    event.clientY < rect.top ||
                    event.clientX > rect.right ||
                    event.clientY > rect.bottom
                ) {
                    modalA11y.close();
                }
            }
        );
    }

    // Alto contraste
    if (toggleContraste) {
        toggleContraste.addEventListener(
            'change',
            () => {
                document.body.classList.toggle(
                    'modo-alto-contraste',
                    toggleContraste.checked
                );

                localStorage.setItem(
                    'a11y_contraste',
                    toggleContraste.checked
                );
            }
        );
    }

    // Texto grande
    if (toggleTexto) {
        toggleTexto.addEventListener(
            'change',
            () => {
                document.body.classList.toggle(
                    'modo-texto-grande',
                    toggleTexto.checked
                );

                localStorage.setItem(
                    'a11y_texto',
                    toggleTexto.checked
                );
            }
        );
    }

    // Fonte para dislexia
    if (toggleDislexia) {
        toggleDislexia.addEventListener(
            'change',
            () => {
                document.body.classList.toggle(
                    'modo-dislexia',
                    toggleDislexia.checked
                );

                localStorage.setItem(
                    'a11y_dislexia',
                    toggleDislexia.checked
                );
            }
        );
    }

    // Sublinhar links
    if (toggleLinks) {
        toggleLinks.addEventListener(
            'change',
            () => {
                document.body.classList.toggle(
                    'modo-sublinhar',
                    toggleLinks.checked
                );

                localStorage.setItem(
                    'a11y_links',
                    toggleLinks.checked
                );
            }
        );
    }

    // Restaurar padrão
    if (btnRestaurar) {
        btnRestaurar.addEventListener('click', () => {
            document.body.classList.remove(
                'modo-alto-contraste',
                'modo-texto-grande',
                'modo-dislexia',
                'modo-sublinhar'
            );

            if (toggleContraste) {
                toggleContraste.checked = false;
            }

            if (toggleTexto) {
                toggleTexto.checked = false;
            }

            if (toggleDislexia) {
                toggleDislexia.checked = false;
            }

            if (toggleLinks) {
                toggleLinks.checked = false;
            }

            // Apaga somente as preferências
            // de acessibilidade.
            localStorage.removeItem(
                'a11y_contraste'
            );

            localStorage.removeItem(
                'a11y_texto'
            );

            localStorage.removeItem(
                'a11y_dislexia'
            );

            localStorage.removeItem(
                'a11y_links'
            );
        });
    }

    // Carregar preferências salvas
    if (
        localStorage.getItem(
            'a11y_contraste'
        ) === 'true' &&
        toggleContraste
    ) {
        toggleContraste.checked = true;

        document.body.classList.add(
            'modo-alto-contraste'
        );
    }

    if (
        localStorage.getItem(
            'a11y_texto'
        ) === 'true' &&
        toggleTexto
    ) {
        toggleTexto.checked = true;

        document.body.classList.add(
            'modo-texto-grande'
        );
    }

    if (
        localStorage.getItem(
            'a11y_dislexia'
        ) === 'true' &&
        toggleDislexia
    ) {
        toggleDislexia.checked = true;

        document.body.classList.add(
            'modo-dislexia'
        );
    }

    if (
        localStorage.getItem(
            'a11y_links'
        ) === 'true' &&
        toggleLinks
    ) {
        toggleLinks.checked = true;

        document.body.classList.add(
            'modo-sublinhar'
        );
    }

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

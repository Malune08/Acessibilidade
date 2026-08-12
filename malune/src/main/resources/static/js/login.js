document.addEventListener('DOMContentLoaded', () => {
    const modalA11y = document.getElementById('modal-a11y');
    const btnAbrirA11y = document.getElementById('btn-abrir-a11y');
    const btnFecharA11y = document.getElementById('btn-fechar-a11y');
    const btnRestaurar = document.getElementById('btn-restaurar');

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
            if (typeof modalA11y.showModal === 'function') {
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

    // Alto contraste
    if (toggleContraste) {
        toggleContraste.addEventListener('change', () => {
            document.body.classList.toggle(
                'modo-alto-contraste',
                toggleContraste.checked
            );

            localStorage.setItem(
                'a11y_contraste',
                toggleContraste.checked
            );
        });
    }

    // Texto grande
    if (toggleTexto) {
        toggleTexto.addEventListener('change', () => {
            document.body.classList.toggle(
                'modo-texto-grande',
                toggleTexto.checked
            );

            localStorage.setItem(
                'a11y_texto',
                toggleTexto.checked
            );
        });
    }

    // Fonte para dislexia
    if (toggleDislexia) {
        toggleDislexia.addEventListener('change', () => {
            document.body.classList.toggle(
                'modo-dislexia',
                toggleDislexia.checked
            );

            localStorage.setItem(
                'a11y_dislexia',
                toggleDislexia.checked
            );
        });
    }

    // Sublinhar links
    if (toggleLinks) {
        toggleLinks.addEventListener('change', () => {
            document.body.classList.toggle(
                'modo-sublinhar',
                toggleLinks.checked
            );

            localStorage.setItem(
                'a11y_links',
                toggleLinks.checked
            );
        });
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

            // Não utiliza localStorage.clear()
            localStorage.removeItem('a11y_contraste');
            localStorage.removeItem('a11y_texto');
            localStorage.removeItem('a11y_dislexia');
            localStorage.removeItem('a11y_links');
        });
    }

    // Carregar preferências
    if (
        localStorage.getItem('a11y_contraste') === 'true' &&
        toggleContraste
    ) {
        toggleContraste.checked = true;
        document.body.classList.add('modo-alto-contraste');
    }

    if (
        localStorage.getItem('a11y_texto') === 'true' &&
        toggleTexto
    ) {
        toggleTexto.checked = true;
        document.body.classList.add('modo-texto-grande');
    }

    if (
        localStorage.getItem('a11y_dislexia') === 'true' &&
        toggleDislexia
    ) {
        toggleDislexia.checked = true;
        document.body.classList.add('modo-dislexia');
    }

    if (
        localStorage.getItem('a11y_links') === 'true' &&
        toggleLinks
    ) {
        toggleLinks.checked = true;
        document.body.classList.add('modo-sublinhar');
    }

    // Login
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Pega o valor do campo de e-mail
            const email = document.getElementById('identificador').value;
            console.log("PEGUEI O EMAUL")
            const senha = document.getElementById('senha').value;
            console.log("PEGUEI A SENHA")


            // Limpa mensagem de erro da tela (se houver)
            const loginError = document.getElementById('login-error');
            if (loginError) {
                loginError.hidden = true;
                loginError.textContent = '';
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        senha
                    })
                });

                // Se o servidor respondeu com status de erro (400, 401, 500, etc.)
                if (!response.ok) {
                    if (response.status === 400) {
                        alert('Verifique os dados digitados: o formato do e-mail é inválido.');
                    } else if (response.status === 401) {
                        alert('E-mail ou senha incorretos.');
                    } else {
                        alert('Ocorreu um erro no servidor. Tente novamente.');
                    }
                    return;
                }

                // Tenta converter para JSON com segurança
                let resultado;
                try {
                    resultado = await response.json();
                } catch (errJson) {
                    console.error('A resposta do servidor não é um JSON válido:', errJson);
                    alert('Resposta inválida do servidor.');
                    return;
                }

                // Redirecionamento baseado na resposta
                if (resultado.tipo === 'USUARIO') {
                    localStorage.setItem('id_usuario', resultado.id);
                    localStorage.setItem('tipo_usuario', resultado.tipo); // Recomendado salvar o tipo
                    window.location.href = 'produtos.html';

                } else if (resultado.tipo === 'ADMINISTRADOR') {
                    // CERTIFIQUE-SE DE SALVAR O ID E O TIPO AQUI TAMBÉM:
                    localStorage.setItem('id_usuario', resultado.id);
                    localStorage.setItem('tipo_usuario', resultado.tipo);

                    // Redireciona para o painel adm
                    window.location.href = 'principal-adm.html';
                } else {
                    alert('E-mail ou senha incorretos.');
                }

            } catch (erro) {
                console.log("DEU ERRO DE CONEXÃO")
                console.error('Erro de conexão/rede ao tentar fazer login:' + erro);
                alert('Não foi possível conectar ao servidor. Tente novamente.');
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Modal de acessibilidade
    const btnAbrirA11y =
        document.getElementById('btn-abrir-a11y');

    const btnFecharA11y =
        document.getElementById('btn-fechar-a11y');

    const modalA11y =
        document.getElementById('modal-a11y');

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

    // Abrir modal
    if (btnAbrirA11y && modalA11y) {
        btnAbrirA11y.addEventListener('click', () => {
            modalA11y.showModal();
        });
    }

    // Fechar modal
    if (btnFecharA11y && modalA11y) {
        btnFecharA11y.addEventListener('click', () => {
            modalA11y.close();
        });
    }

    // Fechar ao clicar fora
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

    function aplicarAcessibilidade(
        checkbox,
        nomeClasse,
        chaveStorage
    ) {
        if (!checkbox) {
            return;
        }

        if (
            localStorage.getItem(chaveStorage) === 'true'
        ) {
            checkbox.checked = true;
            document.body.classList.add(nomeClasse);
        }

        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                document.body.classList.add(nomeClasse);

                localStorage.setItem(
                    chaveStorage,
                    'true'
                );
            } else {
                document.body.classList.remove(nomeClasse);

                localStorage.setItem(
                    chaveStorage,
                    'false'
                );
            }
        });
    }

    aplicarAcessibilidade(
        toggleContraste,
        'modo-alto-contraste',
        'a11y_contraste'
    );

    aplicarAcessibilidade(
        toggleTexto,
        'modo-texto-grande',
        'a11y_texto'
    );

    aplicarAcessibilidade(
        toggleDislexia,
        'modo-dislexia',
        'a11y_dislexia'
    );

    aplicarAcessibilidade(
        toggleLinks,
        'modo-sublinhar',
        'a11y_links'
    );

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

            localStorage.removeItem('a11y_contraste');
            localStorage.removeItem('a11y_texto');
            localStorage.removeItem('a11y_dislexia');
            localStorage.removeItem('a11y_links');
        });
    }

    // Formulário de cadastro
    const formCadastro =
        document.getElementById('form-cadastro');

    if (formCadastro) {
        formCadastro.addEventListener(
            'submit',
            async (evento) => {
                evento.preventDefault();

                const formData =
                    new FormData(formCadastro);

                const dadosUsuario =
                    Object.fromEntries(
                        formData.entries()
                    );

                if (
                    dadosUsuario.senha !==
                    dadosUsuario.confirmar_senha
                ) {
                    alert(
                        'As senhas não coincidem!'
                    );

                    return;
                }

                delete dadosUsuario.confirmar_senha;

                try {
                    console.log(
                        'Enviando JSON para o back-end:',
                        dadosUsuario
                    );

                    /*
                    const resposta = await fetch(
                        'http://localhost:8080/usuarios',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type':
                                    'application/json'
                            },
                            body: JSON.stringify(
                                dadosUsuario
                            )
                        }
                    );

                    if (resposta.ok) {
                        alert(
                            'Cadastro realizado com sucesso!'
                        );

                        // window.location.href =
                        //     '/login.html';
                    } else {
                        const erro =
                            await resposta.json();

                        alert(
                            'Erro ao cadastrar: ' +
                            erro.message
                        );
                    }
                    */

                    alert(
                        'Simulação de envio! Cheque o console (F12) para ver o JSON montado.'
                    );
                } catch (error) {
                    console.error(
                        'Erro na comunicação com a API:',
                        error
                    );

                    alert(
                        'Ocorreu um erro no servidor.'
                    );
                }
            }
        );
    }
});
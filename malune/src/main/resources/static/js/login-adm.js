document.addEventListener('DOMContentLoaded', () => {
    const modalA11y = document.getElementById('modal-a11y');
    const btnAbrirA11y = document.getElementById('btn-abrir-a11y');
    const btnFecharA11y = document.getElementById('btn-fechar-a11y');
    const btnRestaurar = document.getElementById('btn-restaurar');

    const toggleContraste = document.getElementById('toggle-contraste');
    const toggleTexto = document.getElementById('toggle-texto');
    const toggleDislexia = document.getElementById('toggle-dislexia');
    const toggleLinks = document.getElementById('toggle-links');

    // Abrir modal de acessibilidade
    if (btnAbrirA11y && modalA11y) {
        btnAbrirA11y.addEventListener('click', () => {
            if (typeof modalA11y.showModal === 'function') {
                modalA11y.showModal();
            } else {
                alert("Seu navegador não suporta recursos de diálogo.");
            }
        });
    }

    // Fechar modal pelo botão "X"
    if (btnFecharA11y && modalA11y) {
        btnFecharA11y.addEventListener('click', () => {
            modalA11y.close();
        });
    }

    // Fechar modal ao clicar fora dele
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

    // Alto Contraste
    if (toggleContraste) {
        toggleContraste.addEventListener('change', () => {
            document.body.classList.toggle('modo-alto-contraste', toggleContraste.checked);
            localStorage.setItem('a11y_contraste', toggleContraste.checked);
        });
    }

    // Texto Grande
    if (toggleTexto) {
        toggleTexto.addEventListener('change', () => {
            document.body.classList.toggle('modo-texto-grande', toggleTexto.checked);
            localStorage.setItem('a11y_texto', toggleTexto.checked);
        });
    }

    // Dislexia
    if (toggleDislexia) {
        toggleDislexia.addEventListener('change', () => {
            document.body.classList.toggle('modo-dislexia', toggleDislexia.checked);
            localStorage.setItem('a11y_dislexia', toggleDislexia.checked);
        });
    }

    // Sublinhar Links
    if (toggleLinks) {
        toggleLinks.addEventListener('change', () => {
            document.body.classList.toggle('modo-sublinhar', toggleLinks.checked);
            localStorage.setItem('a11y_links', toggleLinks.checked);
        });
    }

    // Restaurar Padrão
    if (btnRestaurar) {
        btnRestaurar.addEventListener('click', () => {
            document.body.classList.remove('modo-alto-contraste', 'modo-texto-grande', 'modo-dislexia', 'modo-sublinhar');
            if (toggleContraste) toggleContraste.checked = false;
            if (toggleTexto) toggleTexto.checked = false;
            if (toggleDislexia) toggleDislexia.checked = false;
            if (toggleLinks) toggleLinks.checked = false;
            localStorage.clear();
        });
    }

    // Carregar preferências salvas no localStorage ao iniciar a página
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
});
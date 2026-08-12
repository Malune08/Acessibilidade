const htmlModalA11y = `
<!-- Pop-up de Acessibilidade -->
<dialog id="modal-a11y" aria-labelledby="modal-a11y-title" aria-modal="true">
    <div class="modal-header">
        <h3 id="modal-a11y-title">Acessibilidade</h3>
        <button id="btn-fechar-a11y" type="button" aria-label="Fechar menu de acessibilidade">X</button>
    </div>
   
    <div class="modal-body">
        <div class="a11y-item">
            <div class="a11y-info">
                <strong>Alto contraste</strong>
                <span>Cores fortes para melhor leitura</span>
            </div>
            <label class="switch">
                <input type="checkbox" id="toggle-contraste" aria-label="Alto contraste">
                <span class="slider"></span>
            </label>
        </div>

        <div class="a11y-item">
            <div class="a11y-info">
                <strong>Texto grande</strong>
                <span>Aumenta o tamanho da fonte</span>
            </div>
            <label class="switch">
                <input type="checkbox" id="toggle-texto" aria-label="Texto grande">
                <span class="slider"></span>
            </label>
        </div>

        <div class="a11y-item">
            <div class="a11y-info">
                <strong>Fonte para dislexia</strong>
                <span>Mais fácil de ler</span>
            </div>
            <label class="switch">
                <input type="checkbox" id="toggle-dislexia" aria-label="Fonte para dislexia">
                <span class="slider"></span>
            </label>
        </div>
       
        <div class="a11y-item">
            <div class="a11y-info">
                <strong>Sublinhar links</strong>
                <span>Destaca todos os links</span>
            </div>
            <label class="switch">
                <input type="checkbox" id="toggle-links" aria-label="Sublinhar links">
                <span class="slider"></span>
            </label>
        </div>
    </div>
   
    <div class="modal-footer">
        <button id="btn-restaurar" class="btn-restaurar">Restaurar padrão</button>
    </div>
</dialog>
`;

function iniciarModalA11y() {
    if (!document.getElementById('modal-a11y')) {
        document.body.insertAdjacentHTML('beforeend', htmlModalA11y);
    }

    // ===== MODAL DE ACESSIBILIDADE =====
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
                btnAbrirA11y.setAttribute('aria-expanded', 'true');
            } else {
                alert("Seu navegador não suporta recursos de diálogo.");
            }
        });
    }

    // Fechar modal pelo botão "X"
    if (btnFecharA11y && modalA11y) {
        btnFecharA11y.addEventListener('click', () => {
            modalA11y.close();
            btnAbrirA11y?.setAttribute('aria-expanded', 'false');
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
                btnAbrirA11y?.setAttribute('aria-expanded', 'false');
            }
        });
        modalA11y.addEventListener('close', () => {
            btnAbrirA11y?.setAttribute('aria-expanded', 'false');
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
            localStorage.removeItem('a11y_contraste');
            localStorage.removeItem('a11y_texto');
            localStorage.removeItem('a11y_dislexia');
            localStorage.removeItem('a11y_links');
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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarModalA11y);
} else {
    iniciarModalA11y();
}

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
                alert('Seu navegador não suporta recursos de diálogo.');
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

            // Remove apenas as configurações de acessibilidade
            localStorage.removeItem('a11y_contraste');
            localStorage.removeItem('a11y_texto');
            localStorage.removeItem('a11y_dislexia');
            localStorage.removeItem('a11y_links');
        });
    }

    // Carregar preferências salvas
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

    // Produtos
    const containerProdutos =
        document.getElementById('produtos-container');

    async function carregarProdutoDestaque() {
    try {
        const resposta = await fetch('http://localhost:8080/api/produtos/2');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produto em destaque');
        }

        const produto = await resposta.json();
        const heroDestaque = document.getElementById('hero-produto-destaque');

        if (heroDestaque && produto.imagem) {
            heroDestaque.innerHTML = `<img src="${produto.imagem}" alt="${produto.nome}">`;
        }
    } catch (error) {
        console.error('Erro ao carregar produto em destaque:', error);
    }
}

    async function carregarProdutos() {
    try {
        const resposta = await fetch('http://localhost:8080/api/produtos');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const produtos = await resposta.json();

        const idsDestaque = [3, 4, 5, 6];
        const produtosDestaque = produtos.filter((produto) =>
            idsDestaque.includes(produto.id)
        );

        renderizarCards(produtosDestaque);
    } catch (error) {
        console.error(
            'Erro na comunicação com a API de produtos:',
            error
        );

        if (containerProdutos) {
            containerProdutos.innerHTML =
                '<p>Não foi possível carregar os produtos no momento.</p>';
        }
    }
}

function renderizarCards(produtos) {
    if (!containerProdutos) {
        return;
    }

    containerProdutos.innerHTML = '';

    produtos.forEach((produto) => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        const precoFormatado =
            Number(produto.valorUnitario).toLocaleString(
                'pt-BR',
                {
                    style: 'currency',
                    currency: 'BRL'
                }
            );

        card.innerHTML = `
            <div class="product-image">
                ${produto.imagem
                    ? `<img src="${produto.imagem}" alt="${produto.nome}">` 
                    : 'Foto de brinquedo'}
            </div>

            <div class="product-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>

                <div class="product-price-row">
                    <span class="price">
                        ${precoFormatado}
                    </span>

                    <a href="produto.html?id=${produto.id}"
                        class="btn-ver"
                    >
                        Ver
                    </a>
                </div>
            </div>
        `;

        containerProdutos.appendChild(card);
    });
}

    carregarProdutos();
    carregarProdutoDestaque();
});

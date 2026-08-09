document.addEventListener('DOMContentLoaded', () => {
    const ENDPOINT_PRODUTOS = '/api/produtos';
    const listaCarrinho = document.getElementById('lista-carrinho');
    const subtotalCarrinho = document.getElementById('subtotal-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');
    const prosseguirCompra = document.getElementById('prosseguir-compra');

    function formatarPreco(valor) {
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function lerCarrinho() {
        return JSON.parse(sessionStorage.getItem('carrinho') ?? '[]');
    }

    function salvarCarrinho(carrinho) {
        sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    function atualizarResumo(itens) {
        const subtotal = itens.reduce((total, item) => total + Number(item.produto.valorUnitario) * item.quantidade, 0);
        subtotalCarrinho.textContent = formatarPreco(subtotal);
        totalCarrinho.textContent = formatarPreco(subtotal);
        prosseguirCompra.disabled = itens.length === 0;
    }

    function renderizarCarrinho(produtos) {
        const carrinho = lerCarrinho();
        const itens = carrinho.map((item) => ({ ...item, produto: produtos.find((produto) => produto.id === item.id) })).filter((item) => item.produto);

        listaCarrinho.innerHTML = '';

        if (itens.length === 0) {
            listaCarrinho.innerHTML = '<p class="estado-vazio">Seu carrinho está vazio.</p>';
            atualizarResumo([]);
            return;
        }

        itens.forEach((item) => {
            const elemento = document.createElement('article');
            elemento.className = 'item-carrinho';
            const imagem = item.produto.imagem ? `<img src="${item.produto.imagem}" alt="">` : 'Imagem indisponível';
            elemento.innerHTML = `<div class="imagem-carrinho">${imagem}</div><div><h2>${item.produto.nome}</h2><p>Quantidade: ${item.quantidade}</p><strong>${formatarPreco(item.produto.valorUnitario)}</strong></div><button class="remover-item" type="button">Remover</button>`;
            elemento.querySelector('.remover-item').addEventListener('click', () => {
                salvarCarrinho(lerCarrinho().filter((produto) => produto.id !== item.id));
                renderizarCarrinho(produtos);
            });
            listaCarrinho.appendChild(elemento);
        });

        atualizarResumo(itens);
    }

    async function carregarCarrinho() {
        const carrinho = lerCarrinho();
        if (carrinho.length === 0) {
            atualizarResumo([]);
            return;
        }

        try {
            const resposta = await fetch(ENDPOINT_PRODUTOS, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
            if (!resposta.ok) throw new Error('Falha ao carregar produtos');
            renderizarCarrinho(await resposta.json());
        } catch (erro) {
            console.error('Erro ao carregar carrinho:', erro);
            listaCarrinho.innerHTML = '<p class="estado-vazio">Não foi possível carregar seu carrinho.</p>';
            atualizarResumo([]);
        }
    }

    prosseguirCompra.addEventListener('click', () => { window.location.href = 'endereco.html'; });
    carregarCarrinho();
});

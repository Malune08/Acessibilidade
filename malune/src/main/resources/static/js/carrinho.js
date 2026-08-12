document.addEventListener('DOMContentLoaded', () => {
    const listaCarrinho = document.getElementById('lista-carrinho');
    const subtotalCarrinho = document.getElementById('subtotal-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');
    const prosseguirCompra = document.getElementById('prosseguir-compra');
    const idUsuario = localStorage.getItem('id_usuario');
    let carrinhoAtual = { itens: [], total: 0 };

    function formatarPreco(valor) {
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function atualizarResumo() {
        subtotalCarrinho.textContent = formatarPreco(carrinhoAtual.total);
        totalCarrinho.textContent = formatarPreco(carrinhoAtual.total);
        prosseguirCompra.disabled = carrinhoAtual.itens.length === 0;
    }

    function mostrarEstadoVazio(mensagem) {
        listaCarrinho.innerHTML = `<p class="estado-vazio">${mensagem}</p>`;
        carrinhoAtual = { itens: [], total: 0 };
        atualizarResumo();
    }

    function renderizarCarrinho(carrinho) {
        carrinhoAtual = carrinho;
        listaCarrinho.innerHTML = '';

        if (carrinho.itens.length === 0) {
            mostrarEstadoVazio('Seu carrinho está vazio.');
            return;
        }

        carrinho.itens.forEach((item) => {
            const elemento = document.createElement('article');
            elemento.className = 'item-carrinho';
            const imagem = item.imagem ? `<img src="${item.imagem}" alt="">` : 'Imagem indisponível';
            elemento.innerHTML = `<div class="imagem-carrinho">${imagem}</div><div><h2>${item.nome}</h2><p>Quantidade: ${item.quantidade}</p><strong>${formatarPreco(item.subtotal)}</strong></div><button class="remover-item" type="button" aria-label="Remover ${item.nome}" title="Remover produto"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 9h8v10H8V9Zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5Z"/></svg></button>`;
            elemento.querySelector('.remover-item').addEventListener('click', () => removerItem(item.idProduto));
            listaCarrinho.appendChild(elemento);
        });

        atualizarResumo();
    }

    async function migrarCarrinhoTemporario() {
        const itensTemporarios = JSON.parse(sessionStorage.getItem('carrinho') ?? '[]');
        if (!idUsuario || itensTemporarios.length === 0) {
            return;
        }

        for (const item of itensTemporarios) {
            const resposta = await fetch(`/carrinho/${idUsuario}/itens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idProduto: item.id, quantidade: item.quantidade })
            });
            if (!resposta.ok) {
                throw new Error('Não foi possível migrar os itens do carrinho.');
            }
        }
        sessionStorage.removeItem('carrinho');
    }

    async function carregarCarrinho() {
        if (!idUsuario) {
            mostrarEstadoVazio('Faça login novamente para acessar seu carrinho.');
            return;
        }

        try {
            await migrarCarrinhoTemporario();
            const resposta = await fetch(`/carrinho/${idUsuario}`);
            if (!resposta.ok) {
                throw new Error('Não foi possível carregar seu carrinho.');
            }
            renderizarCarrinho(await resposta.json());
        } catch (erro) {
            mostrarEstadoVazio(erro.message);
        }
    }

    async function removerItem(idProduto) {
        try {
            const resposta = await fetch(`/carrinho/${idUsuario}/itens/${idProduto}`, { method: 'DELETE' });
            if (!resposta.ok) {
                throw new Error('Não foi possível remover o produto.');
            }
            await carregarCarrinho();
        } catch (erro) {
            mostrarEstadoVazio(erro.message);
        }
    }

    prosseguirCompra.addEventListener('click', () => {
        if (carrinhoAtual.itens.length === 0) {
            return;
        }

        const itensPedido = carrinhoAtual.itens.map((item) => ({
            idProduto: item.idProduto,
            quantidade: item.quantidade
        }));
        localStorage.setItem('itens_pedido', JSON.stringify(itensPedido));
        localStorage.setItem('total_pedido', String(carrinhoAtual.total));
        window.location.href = 'endereco.html';
    });

    carregarCarrinho();
});

document.addEventListener('DOMContentLoaded', () => {
    const listaPedidos = document.getElementById('lista-pedidos');
    const idUsuario = localStorage.getItem('id_usuario');

    function formatarData(data) {
        return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');
    }

    function formatarPreco(valor) {
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function escaparHtml(texto) {
        const elemento = document.createElement('span');
        elemento.textContent = texto;
        return elemento.innerHTML;
    }

    function mostrarEstadoVazio(mensagem) {
        listaPedidos.innerHTML = `<p class="estado-vazio">${escaparHtml(mensagem)}</p>`;
    }

    function renderizarPedidos(pedidos) {
        if (pedidos.length === 0) {
            mostrarEstadoVazio('Você ainda não tem pedidos.');
            return;
        }

        listaPedidos.innerHTML = '';
        pedidos.forEach((pedido) => {
            const item = document.createElement('article');
            item.className = 'pedido';
            const produtos = pedido.produtos?.join(', ') || `Pedido #${pedido.id}`;
            item.innerHTML = `<div><strong>${escaparHtml(produtos)}</strong><p>Pedido #${pedido.id} · ${formatarData(pedido.dataPedido)} · ${formatarPreco(pedido.valorTotal)}</p></div><span class="pedido-status">${escaparHtml(pedido.status)}</span>`;
            listaPedidos.appendChild(item);
        });
    }

    async function carregarPedidos() {
        if (!idUsuario) {
            mostrarEstadoVazio('Faça login novamente para ver seus pedidos.');
            return;
        }

        try {
            const resposta = await fetch(`/pedido/${idUsuario}`);
            if (!resposta.ok) {
                throw new Error('Não foi possível carregar seus pedidos.');
            }
            renderizarPedidos(await resposta.json());
        } catch (erro) {
            mostrarEstadoVazio(erro.message);
        }
    }

    carregarPedidos();
});

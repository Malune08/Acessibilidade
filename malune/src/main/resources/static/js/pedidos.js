document.addEventListener('DOMContentLoaded', () => {
    const listaPedidos = document.getElementById('lista-pedidos');
    const pedidos = JSON.parse(sessionStorage.getItem('pedidos') ?? '[]');

    if (pedidos.length === 0) {
        return;
    }

    listaPedidos.innerHTML = '';

    pedidos.forEach((pedido) => {
        const item = document.createElement('article');
        item.className = 'pedido';
        item.innerHTML = `<div><strong>Pedido #${pedido.id}</strong><p>${pedido.data}</p></div><span class="pedido-status">${pedido.status}</span>`;
        listaPedidos.appendChild(item);
    });
});

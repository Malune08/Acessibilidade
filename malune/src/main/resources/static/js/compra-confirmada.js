document.addEventListener('DOMContentLoaded', () => {
    // ===== LÓGICA DE COMPRA CONFIRMADA =====

    const btnVerPedido =
        document.querySelector('.btn-ver-pedido');

    const btnContinuarComprando =
        document.querySelector('.btn-continuar-comprando');

    if (btnVerPedido) {
        btnVerPedido.addEventListener('click', () => {
            window.location.href = 'pedidos.html';
        });
    }

    if (btnContinuarComprando) {
        btnContinuarComprando.addEventListener('click', () => {
            // Limpa apenas os dados temporários da compra
            localStorage.removeItem('pagamento_dados');
            localStorage.removeItem('endereco_dados');
            localStorage.removeItem('total_pedido');
            localStorage.removeItem('id_pagamento');

            window.location.href = 'produtos.html';
        });
    }
});

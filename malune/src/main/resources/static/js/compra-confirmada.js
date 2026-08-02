document.addEventListener('DOMContentLoaded', () => {
    // ===== LÓGICA DE COMPRA CONFIRMADA =====
        // Limpar dados de pagamento do localStorage
    localStorage.removeItem('pagamento_dados');
    localStorage.removeItem('endereco_dados');
    localStorage.removeItem('total_pedido');
    localStorage.removeItem('id_pagamento');    
});
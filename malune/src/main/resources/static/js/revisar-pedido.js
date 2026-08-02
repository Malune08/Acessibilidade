document.addEventListener('DOMContentLoaded', () => {
    // ===== REVISÃO DO PEDIDO =====
    const formRevisao = document.getElementById('form-revisao');
    const revisaoRua = document.getElementById('revisao-rua');
    const revisaoNumero = document.getElementById('revisao-numero');
    const revisaoPagamentoIcon = document.getElementById('revisao-pagamento-icon');
    const revisaoPagamentoTexto = document.getElementById('revisao-pagamento-texto');
    const revisaoTotal = document.getElementById('revisao-total');

    // Recuperar dados do localStorage
    const dadosEndereco = JSON.parse(localStorage.getItem('endereco_dados')) || {};
    const dadosPagamento = JSON.parse(localStorage.getItem('pagamento_dados')) || {};
    const totalPedido = localStorage.getItem('total_pedido') || '0';

    // Preencher campos de endereço
    revisaoRua.value = dadosEndereco.rua || '';
    revisaoNumero.value = dadosEndereco.numero || '';

    // Preencher forma de pagamento
    function definirFormasPagamento() {
        const formaId = dadosPagamento.forma_pagamento;
        let nomePagamento = '';
        let iconPagamento = '';

        if (formaId === '1') {
            nomePagamento = 'PIX';
            iconPagamento = 'images/pix-logo.png';
        } else if (formaId === '2') {
            nomePagamento = 'Cartão de Débito/Crédito';
            iconPagamento = 'images/cartao-logo.png';
        } else if (formaId === '3') {
            nomePagamento = 'Boleto';
            iconPagamento = 'images/boleto-logo.png';
        }

        revisaoPagamentoTexto.textContent = nomePagamento;
        revisaoPagamentoIcon.src = iconPagamento;
        revisaoPagamentoIcon.alt = nomePagamento;
    }

    // Preencher total
    function formatarTotal() {
        const totalFloat = parseFloat(totalPedido);
        revisaoTotal.value = `R$ ${totalFloat.toFixed(2).replace('.', ',')}`;
    }

    definirFormasPagamento();
    formatarTotal();

    // Enviar formulário (confirmar pedido)
    formRevisao.addEventListener('submit', (e) => {
        e.preventDefault();

        // Preparar dados finais do pedido
        const dadosPedido = {
            endereco: dadosEndereco,
            pagamento: dadosPagamento,
            total: totalPedido,
            data_pedido: new Date().toISOString()
        };

        // Armazenar no localStorage (temporário)
        localStorage.setItem('pedido_confirmado', JSON.stringify(dadosPedido));

        // Redirecionar para página de confirmação
        window.location.href = 'compra-confirmada.html';
    });
});
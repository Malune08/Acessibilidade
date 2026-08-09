document.addEventListener('DOMContentLoaded', () => {
    // ===== REVISÃO DO PEDIDO =====
    const formRevisao = document.getElementById('form-revisao');
    const revisaoRua = document.getElementById('revisao-rua');
    const revisaoNumero = document.getElementById('revisao-numero');
    const revisaoPagamentoIcon = document.getElementById('revisao-pagamento-icon');
    const revisaoPagamentoTexto = document.getElementById('revisao-pagamento-texto');
    const revisaoTotal = document.getElementById('revisao-total');

    const idUsuario = localStorage.getItem('id_usuario');

    // Recuperar dados do localStorage
    const dadosEndereco = JSON.parse(localStorage.getItem('endereco_dados')) || {};
    const dadosPagamento = JSON.parse(localStorage.getItem('pagamento_dados')) || {};
    const itensPedido = JSON.parse(localStorage.getItem('itens_pedido')) || [];
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

    // Converte o value do radio ('1'/'2'/'3') pro enum que o backend espera
    function converterFormaPagamento(formaId) {
        if (formaId === '1') return 'PIX';
        if (formaId === '2') return 'CARTAO';
        if (formaId === '3') return 'BOLETO';
        return null;
    }

    definirFormasPagamento();
    formatarTotal();

    // Enviar formulário (confirmar pedido)
    formRevisao.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!idUsuario) {
            alert('Usuário não identificado. Faça login novamente.');
            return;
        }

        if (itensPedido.length === 0) {
            alert('Nenhum item encontrado no pedido. Volte ao carrinho.');
            return;
        }

        // Monta o corpo esperado pelo backend
        const corpo = {
            itens: itensPedido,
            formaPagamento: converterFormaPagamento(dadosPagamento.forma_pagamento)
        };

        if (dadosPagamento.tipo_cartao === 'existente') {
            corpo.cartaoId = dadosPagamento.cartao_id;
        } else if (dadosPagamento.tipo_cartao === 'novo') {
            corpo.cartaoNovo = {
                numero: dadosPagamento.cartao_novo.numero,
                nome: dadosPagamento.cartao_novo.nome,
                validade: dadosPagamento.cartao_novo.validade,
                cvv: dadosPagamento.cartao_novo.cvv,
                tipo: dadosPagamento.cartao_novo.tipo
            };
        }

        try {
            const resposta = await fetch(`/pedido/${idUsuario}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(corpo)
            });

            if (!resposta.ok) {
                throw new Error('Não foi possível processar o pedido.');
            }

            const resultado = await resposta.json();

            // Se o pagamento foi recusado, avisa e mantém o usuário nessa tela
            if (resultado.statusPagamento === 'RECUSADO') {
                alert('Seu pagamento foi recusado. Tente novamente ou escolha outra forma de pagamento.');
                return;
            }

            // Guarda pra próxima tela usar
            localStorage.setItem('id_pagamento', resultado.idPagamento);
            localStorage.setItem('status_pagamento', resultado.statusPagamento);

            window.location.href = 'compra-confirmada.html';
        } catch (erro) {
            alert('Erro ao confirmar o pedido: ' + erro.message);
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // ===== LÓGICA DE PAGAMENTO =====
    const formPagamento = document.getElementById('form-pagamento');
    const radioPagamento = document.querySelectorAll('input[name="forma_pagamento"]');
    const camposCartao = document.getElementById('campos-cartao');
    const camposPix = document.getElementById('campos-pix');
    const camposBoleto = document.getElementById('campos-boleto');
    const totalValor = document.getElementById('total-valor');

    // Referências cartão
    const containerCartoes = document.getElementById('container-cartoes');
    const listaCartoes = document.getElementById('lista-cartoes');
    const formularioNovoCartao = document.getElementById('formulario-novo-cartao');
    const btnAdicionarCartao = document.getElementById('btn-adicionar-cartao');
    const btnCancelarNovoCartao = document.getElementById('btn-cancelar-novo-cartao');

    // Usuário logado
    const idUsuario = localStorage.getItem('id_usuario');

    // Dados globais
    let cartoesDisponiveis = [];
    let cartaoSelecionado = null;

    // Recuperar dados do localStorage
    const dadosArmazenados = JSON.parse(localStorage.getItem('pagamento_dados')) || {};
    const totalArmazenado = localStorage.getItem('total_pedido');

    // Atualizar total na tela
    if (totalArmazenado) {
        const totalFloat = parseFloat(totalArmazenado);
        totalValor.innerText = `R$ ${totalFloat.toFixed(2).replace('.', ',')}`;
    }

    // Esconder todos os campos adicionais
    function esconderCampos() {
        camposCartao.style.display = 'none';
        camposPix.style.display = 'none';
        camposBoleto.style.display = 'none';
        camposCartao.setAttribute('aria-hidden', 'true');
        camposPix.setAttribute('aria-hidden', 'true');
        camposBoleto.setAttribute('aria-hidden', 'true');
    }

    // Esconder formulário de novo cartão
    function esconderFormularioNovoCartao() {
        formularioNovoCartao.style.display = 'none';
        formularioNovoCartao.setAttribute('aria-hidden', 'true');
        listaCartoes.style.display = 'block';
        listaCartoes.setAttribute('aria-hidden', 'false');
        cartaoSelecionado = null;
        // Limpar campos
        document.getElementById('numero-cartao').value = '';
        document.getElementById('nome-titular').value = '';
        document.getElementById('validade').value = '';
        document.getElementById('cvv').value = '';
    }

    // ===== CARTÕES CADASTRADOS =====
    // Busca os cartões salvos do usuário logado, direto do backend
    async function buscarCartoes() {
        if (!idUsuario) {
            cartoesDisponiveis = [];
            renderizarCartoes();
            return;
        }

        try {
            const resposta = await fetch(`/cartao/${idUsuario}`);

            if (!resposta.ok) {
                throw new Error('Não foi possível carregar os cartões.');
            }

            cartoesDisponiveis = await resposta.json();
            renderizarCartoes();
        } catch (error) {
            console.error('Erro ao buscar cartões:', error);
            cartoesDisponiveis = [];
            renderizarCartoes();
        }
    }

    // Renderizar lista de cartões
    function renderizarCartoes() {
        containerCartoes.innerHTML = '';

        if (cartoesDisponiveis.length === 0) {
            containerCartoes.innerHTML = '<p class="sem-cartoes">Nenhum cartão cadastrado</p>';
            return;
        }

        cartoesDisponiveis.forEach(cartao => {
            const ultimosDigitos = cartao.numeroCartao.slice(-4);
            const tipoTexto = cartao.tipoCartao === 'DEBITO' ? 'Débito' : 'Crédito';

            const divCartao = document.createElement('div');
            divCartao.className = 'cartao-item';
            divCartao.innerHTML = `
                <label class="radio-cartao">
                    <input type="radio" name="cartao_selecionado" value="${cartao.id}">
                    <span class="radio-custom-cartao"></span>
                    <div class="cartao-info">
                        <div class="cartao-numero">••••••••••••${ultimosDigitos}</div>
                        <div class="cartao-detalhes">
                            <span class="cartao-titular">${cartao.nome}</span>
                            <span class="cartao-tipo">${tipoTexto}</span>
                        </div>
                    </div>
                </label>
            `;
            containerCartoes.appendChild(divCartao);
        });

        // Event listeners nos novos radios
        document.querySelectorAll('input[name="cartao_selecionado"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                cartaoSelecionado = parseInt(e.target.value);
            });
        });
    }

    // Botão "Adicionar novo cartão"
    btnAdicionarCartao.addEventListener('click', () => {
        listaCartoes.style.display = 'none';
        formularioNovoCartao.style.display = 'block';
        listaCartoes.setAttribute('aria-hidden', 'true');
        formularioNovoCartao.setAttribute('aria-hidden', 'false');
    });

    // Botão "Cancelar"
    btnCancelarNovoCartao.addEventListener('click', () => {
        esconderFormularioNovoCartao();
    });

    // Buscar cartões ao carregar a página
    buscarCartoes();

    // Mostrar/esconder campos conforme seleção
    radioPagamento.forEach(radio => {
        radio.addEventListener('change', () => {
            esconderCampos();
            esconderFormularioNovoCartao();
            cartaoSelecionado = null;

            if (document.getElementById('cartao').checked) {
                camposCartao.style.display = 'block';
                camposCartao.setAttribute('aria-hidden', 'false');
            } else if (document.getElementById('pix').checked) {
                camposPix.style.display = 'block';
                camposPix.setAttribute('aria-hidden', 'false');
            } else if (document.getElementById('boleto').checked) {
                camposBoleto.style.display = 'block';
                camposBoleto.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // Copiar PIX
    document.getElementById('btn-copiar-pix').addEventListener('click', function() {
        const input = document.getElementById('pix-codigo');
        input.select();
        input.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(input.value);
        this.textContent = 'Copiado!';
        this.classList.add('copiado');
        setTimeout(() => {
            this.textContent = 'Copiar';
            this.classList.remove('copiado');
        }, 2000);
    });

    // Copiar Boleto
    document.getElementById('btn-copiar-boleto').addEventListener('click', function() {
        const input = document.getElementById('boleto-codigo');
        input.select();
        input.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(input.value);
        this.textContent = 'Copiado!';
        this.classList.add('copiado');
        setTimeout(() => {
            this.textContent = 'Copiar';
            this.classList.remove('copiado');
        }, 2000);
    });

    // Recuperar seleção anterior se existir
    if (dadosArmazenados.forma_pagamento) {
        const radioSelecionado = document.querySelector(`input[value="${dadosArmazenados.forma_pagamento}"]`);
        if (radioSelecionado) {
            radioSelecionado.checked = true;
            esconderCampos();
            esconderFormularioNovoCartao();
            if (radioSelecionado.id === 'cartao') {
                camposCartao.style.display = 'block';
                camposCartao.setAttribute('aria-hidden', 'false');
            } else if (radioSelecionado.id === 'pix') {
                camposPix.style.display = 'block';
                camposPix.setAttribute('aria-hidden', 'false');
            } else if (radioSelecionado.id === 'boleto') {
                camposBoleto.style.display = 'block';
                camposBoleto.setAttribute('aria-hidden', 'false');
            }
        }
    }

    // Recuperar dados do cartão se existirem
    if (dadosArmazenados.numero_cartao) {
        document.getElementById('numero-cartao').value = dadosArmazenados.numero_cartao;
    }
    if (dadosArmazenados.nome_titular) {
        document.getElementById('nome-titular').value = dadosArmazenados.nome_titular;
    }
    if (dadosArmazenados.validade) {
        document.getElementById('validade').value = dadosArmazenados.validade;
    }
    if (dadosArmazenados.cvv) {
        document.getElementById('cvv').value = dadosArmazenados.cvv;
    }

    // Enviar formulário (revisar pagamento)
    formPagamento.addEventListener('submit', (e) => {
        e.preventDefault();

        const formaPagamento = document.querySelector('input[name="forma_pagamento"]:checked').value;

        // Validar seleção de cartão
        if (formaPagamento === '2') {
            // Se selecionou um cartão existente
            if (cartaoSelecionado) {
                // OK - cartão já selecionado
            } else if (formularioNovoCartao.style.display === 'block') {
                // Se está preenchendo novo cartão
                const numeroCartao = document.getElementById('numero-cartao').value.trim();
                const nomeTitular = document.getElementById('nome-titular').value.trim();
                const validade = document.getElementById('validade').value.trim();
                const cvv = document.getElementById('cvv').value.trim();

                if (!numeroCartao || !nomeTitular || !validade || !cvv) {
                    alert('Por favor, preencha todos os campos do cartão.');
                    return;
                }
            } else {
                alert('Por favor, selecione um cartão ou adicione um novo.');
                return;
            }
        }

        // Preparar dados para armazenar
        const dadosPagamento = {
            forma_pagamento: formaPagamento
        };

        // Adicionar dados conforme forma de pagamento
        if (formaPagamento === '2') {
            if (cartaoSelecionado) {
                // Cartão existente - enviar ID
                dadosPagamento.cartao_id = cartaoSelecionado;
                dadosPagamento.tipo_cartao = 'existente';
            } else {
                // Novo cartão
                dadosPagamento.cartao_novo = {
                    numero: document.getElementById('numero-cartao').value,
                    nome: document.getElementById('nome-titular').value,
                    validade: document.getElementById('validade').value,
                    cvv: document.getElementById('cvv').value,
                    tipo: document.querySelector('input[name="tipo-cartao-novo"]:checked').value
                };
                dadosPagamento.tipo_cartao = 'novo';
            }
        } else if (formaPagamento === '1') {
            dadosPagamento.pix_codigo = document.getElementById('pix-codigo').value;
        } else if (formaPagamento === '3') {
            dadosPagamento.boleto_codigo = document.getElementById('boleto-codigo').value;
        }

        // Armazenar no localStorage
        localStorage.setItem('pagamento_dados', JSON.stringify(dadosPagamento));

        // Redirecionar para próxima página
        window.location.href = 'revisar-pedido.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const ENDPOINT_PRODUTOS = '/api/produtos';

    const detalheProduto = document.getElementById('detalhe-produto');
    const statusProduto = document.getElementById('status-produto');
    const imagemProduto = document.getElementById('imagem-produto');
    const imagemIndisponivel = document.getElementById('imagem-indisponivel');
    const categoriaProduto = document.getElementById('categoria-produto');
    const nomeProduto = document.getElementById('nome-produto');
    const descricaoProduto = document.getElementById('descricao-produto');
    const precoProduto = document.getElementById('preco-produto');
    const estoqueProduto = document.getElementById('estoque-produto');
    const quantidadeProduto = document.getElementById('quantidade-produto');
    const diminuirQuantidade = document.getElementById('diminuir-quantidade');
    const aumentarQuantidade = document.getElementById('aumentar-quantidade');
    const adicionarCarrinho = document.getElementById('adicionar-carrinho');
    const comprarAgora = document.getElementById('comprar-agora');
    const mensagemCarrinho = document.getElementById('mensagem-carrinho');

    let produtoSelecionado;
    let quantidade = 1;

    function formatarPreco(valor) {
        const numero = Number(valor);

        return Number.isNaN(numero)
            ? 'R$ 0,00'
            : numero.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
    }

    function obterImagem(produto) {
        return (
            produto.foto ??
            produto.imagemUrl ??
            produto.urlImagem ??
            produto.imagemBase64 ??
            produto.imagem ??
            null
        );
    }

    function obterCategoria(produto) {
        if (produto.categoria && typeof produto.categoria === 'object') {
            return produto.categoria.categoria ?? produto.categoria.nome ?? 'Sem categoria';
        }

        return produto.categoria ?? produto.nomeCategoria ?? 'Sem categoria';
    }

    function atualizarQuantidade() {
        quantidadeProduto.value = String(quantidade);
        quantidadeProduto.textContent = String(quantidade);

        const estoque = Number(produtoSelecionado.qtdEstoque ?? produtoSelecionado.qtd_estoque ?? 0);
        diminuirQuantidade.disabled = quantidade <= 1;
        aumentarQuantidade.disabled = quantidade >= estoque;
    }

    function exibirProduto(produto) {
        produtoSelecionado = produto;
        const imagem = obterImagem(produto);
        const estoque = Number(produto.qtdEstoque ?? produto.qtd_estoque ?? 0);

        nomeProduto.textContent = produto.nome ?? 'Produto sem nome';
        descricaoProduto.textContent = produto.descricao ?? '';
        categoriaProduto.textContent = obterCategoria(produto);
        precoProduto.textContent = formatarPreco(produto.valorUnitario ?? produto.valor_unitario ?? produto.preco);
        estoqueProduto.textContent = estoque > 0
            ? `${estoque} em estoque`
            : 'Produto esgotado';

        if (imagem) {
            imagemProduto.src = imagem;
            imagemProduto.alt = `Foto do produto ${produto.nome ?? ''}`;
            imagemProduto.hidden = false;
            imagemIndisponivel.hidden = true;
            imagemProduto.addEventListener('error', () => {
                imagemProduto.hidden = true;
                imagemIndisponivel.hidden = false;
            }, { once: true });
        } else {
            imagemProduto.hidden = true;
            imagemIndisponivel.hidden = false;
        }

        if (estoque <= 0) {
            quantidade = 0;
            adicionarCarrinho.disabled = true;
            comprarAgora.disabled = true;
        }

        atualizarQuantidade();
        statusProduto.hidden = true;
        detalheProduto.hidden = false;
    }

    function mostrarErro(mensagem) {
        statusProduto.textContent = mensagem;
        statusProduto.hidden = false;
    }

    function salvarNoCarrinho() {
        const carrinho = JSON.parse(sessionStorage.getItem('carrinho') ?? '[]');
        const itemExistente = carrinho.find((item) => item.id === produtoSelecionado.id);

        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            carrinho.push({ id: produtoSelecionado.id, quantidade });
        }

        sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    diminuirQuantidade.addEventListener('click', () => {
        if (quantidade > 1) {
            quantidade -= 1;
            atualizarQuantidade();
        }
    });

    aumentarQuantidade.addEventListener('click', () => {
        const estoque = Number(produtoSelecionado.qtdEstoque ?? produtoSelecionado.qtd_estoque ?? 0);

        if (quantidade < estoque) {
            quantidade += 1;
            atualizarQuantidade();
        }
    });

    adicionarCarrinho.addEventListener('click', () => {
        salvarNoCarrinho();
        mensagemCarrinho.textContent = 'Produto adicionado ao carrinho.';
    });

    comprarAgora.addEventListener('click', () => {
        salvarNoCarrinho();
        window.location.href = 'endereco.html';
    });

    async function carregarProduto() {
        const parametros = new URLSearchParams(window.location.search);
        const idProduto = parametros.get('id') ?? sessionStorage.getItem('produto_selecionado');

        if (!idProduto) {
            mostrarErro('Selecione um produto para ver os detalhes.');
            return;
        }

        try {
            const resposta = await fetch(ENDPOINT_PRODUTOS, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin'
            });

            if (!resposta.ok) {
                throw new Error(`O servidor retornou o status ${resposta.status}.`);
            }

            const produtos = await resposta.json();
            const produto = produtos.find((item) => String(item.id) === String(idProduto));

            if (!produto) {
                mostrarErro('Produto não encontrado.');
                return;
            }

            exibirProduto(produto);
        } catch (erro) {
            console.error('Erro ao carregar o produto:', erro);
            mostrarErro('Não foi possível carregar este produto. Tente novamente mais tarde.');
        }
    }

    carregarProduto();
});

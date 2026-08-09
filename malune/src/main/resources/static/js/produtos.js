document.addEventListener('DOMContentLoaded', () => {
    /*
     * Endpoint real do backend.
     *
     * Caso o ProdutoController utilize outra rota,
     * altere somente esta constante.
     */
    const ENDPOINT_PRODUTOS = '/produtos';

    const gradeProdutos =
        document.getElementById('grade-produtos');

    const campoBusca =
        document.getElementById('busca-produto');

    const filtroPreco =
        document.getElementById('filtro-preco');

    const valorPreco =
        document.getElementById('valor-preco');

    const listaCategorias =
        document.getElementById('lista-categorias');

    const resultadoFiltros =
        document.getElementById('resultado-filtros');

    let produtos = [];
    let categoriaSelecionada = 'Todos';

    /**
     * Formata um valor como moeda brasileira.
     */
    function formatarPreco(valor) {
        const numero = Number(valor);

        if (Number.isNaN(numero)) {
            return 'R$ 0,00';
        }

        return numero.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    /**
     * Normaliza textos para facilitar buscas.
     */
    function normalizarTexto(texto) {
        return String(texto ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    /**
     * Transforma um array de bytes em Base64.
     *
     * Essa função é utilizada caso o backend retorne
     * a imagem como uma lista de números.
     */
    function converterBytesParaBase64(bytes) {
        const arrayBytes = new Uint8Array(bytes);

        let binario = '';

        for (let indice = 0; indice < arrayBytes.length; indice++) {
            binario += String.fromCharCode(arrayBytes[indice]);
        }

        return btoa(binario);
    }

    /**
     * Obtém a imagem do produto.
     *
     * Aceita:
     * - URL
     * - caminho de arquivo
     * - Data URL
     * - Base64
     * - array de bytes
     */
    function obterImagemProduto(produto) {
        const imagem =
            produto.foto ??
            produto.imagemUrl ??
            produto.urlImagem ??
            produto.imagemBase64 ??
            produto.imagem ??
            null;

        if (!imagem) {
            return null;
        }

        const tipoImagem =
            produto.tipoImagem ??
            produto.contentTypeImagem ??
            produto.contentType ??
            'image/jpeg';

        /*
         * Imagem retornada como array de bytes.
         */
        if (Array.isArray(imagem)) {
            const imagemBase64 =
                converterBytesParaBase64(imagem);

            return `data:${tipoImagem};base64,${imagemBase64}`;
        }

        if (typeof imagem !== 'string') {
            return null;
        }

        const valorImagem = imagem.trim();

        /*
         * Data URL pronta.
         */
        if (valorImagem.startsWith('data:image/')) {
            return valorImagem;
        }

        /*
         * URL completa ou caminho iniciado com barra.
         */
        if (
            valorImagem.startsWith('http://') ||
            valorImagem.startsWith('https://') ||
            valorImagem.startsWith('/')
        ) {
            return valorImagem;
        }

        /*
         * Caminho de imagem, por exemplo:
         * images/brinquedo.png
         */
        const pareceCaminhoDeImagem =
            /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(valorImagem);

        if (pareceCaminhoDeImagem) {
            return valorImagem;
        }

        /*
         * Caso contrário, considera que o backend
         * enviou apenas a sequência Base64.
         */
        return `data:${tipoImagem};base64,${valorImagem}`;
    }

    /**
     * Obtém o nome da categoria.
     *
     * Aceita categoria como objeto:
     * {
     *     id: 1,
     *     categoria: "Pelúcias"
     * }
     *
     * Ou diretamente como texto:
     * "Pelúcias"
     */
    function obterCategoriaProduto(produto) {
        if (
            produto.categoria &&
            typeof produto.categoria === 'object'
        ) {
            return (
                produto.categoria.categoria ??
                produto.categoria.nome ??
                'Sem categoria'
            );
        }

        return (
            produto.categoria ??
            produto.nomeCategoria ??
            'Sem categoria'
        );
    }

    /**
     * Padroniza os nomes vindos do backend.
     */
    function normalizarProduto(produto) {
        return {
            id: produto.id,

            nome:
                produto.nome ??
                'Produto sem nome',

            descricao:
                produto.descricao ??
                '',

            categoria:
                obterCategoriaProduto(produto),

            preco: Number(
                produto.valorUnitario ??
                produto.valor_unitario ??
                produto.preco ??
                0
            ),

            qtdEstoque: Number(
                produto.qtdEstoque ??
                produto.qtd_estoque ??
                produto.quantidadeEstoque ??
                0
            ),

            imagem:
                obterImagemProduto(produto)
        };
    }

    /**
     * Cria um elemento com mensagem.
     */
    function criarMensagem(classe, titulo, descricao) {
        const container = document.createElement('div');
        container.className = classe;

        const textoTitulo = document.createElement('strong');
        textoTitulo.textContent = titulo;

        const textoDescricao = document.createElement('p');
        textoDescricao.textContent = descricao;

        container.appendChild(textoTitulo);
        container.appendChild(textoDescricao);

        return container;
    }

    /**
     * Exibe o carregamento.
     */
    function mostrarCarregamento() {
        gradeProdutos.innerHTML = '';

        const mensagem = criarMensagem(
            'mensagem-vazia',
            'Carregando produtos...',
            'Aguarde enquanto buscamos os produtos disponíveis.'
        );

        mensagem.setAttribute('role', 'status');

        gradeProdutos.appendChild(mensagem);
    }

    /**
     * Exibe um erro de carregamento.
     */
    function mostrarErro(mensagemErro) {
        gradeProdutos.innerHTML = '';

        const mensagem = criarMensagem(
            'mensagem-vazia mensagem-erro',
            'Não foi possível carregar os produtos.',
            mensagemErro
        );

        mensagem.setAttribute('role', 'alert');

        gradeProdutos.appendChild(mensagem);

        resultadoFiltros.textContent =
            'Erro ao carregar os produtos.';
    }

    /**
     * Cria o card de um produto.
     */
    function criarCardProduto(produto) {
        const card = document.createElement('article');
        card.className = 'card-produto';
        card.dataset.id = produto.id;

        const areaImagem = document.createElement('div');
        areaImagem.className = 'foto-produto';

        if (produto.imagem) {
            const imagem = document.createElement('img');

            imagem.className = 'imagem-produto';
            imagem.src = produto.imagem;
            imagem.alt = `Imagem do produto ${produto.nome}`;
            imagem.loading = 'lazy';

            imagem.addEventListener('error', () => {
                areaImagem.innerHTML = '';

                const avisoImagem =
                    document.createElement('span');

                avisoImagem.className =
                    'imagem-indisponivel';

                avisoImagem.textContent =
                    'Imagem indisponível';

                areaImagem.appendChild(avisoImagem);
            });

            areaImagem.appendChild(imagem);
        } else {
            const avisoImagem =
                document.createElement('span');

            avisoImagem.className =
                'imagem-indisponivel';

            avisoImagem.textContent =
                'Imagem indisponível';

            areaImagem.appendChild(avisoImagem);
        }

        const conteudo = document.createElement('div');
        conteudo.className = 'conteudo-produto';

        const titulo = document.createElement('h3');
        titulo.textContent = produto.nome;

        const descricao = document.createElement('p');
        descricao.className = 'descricao-produto';
        descricao.textContent = produto.descricao;

        const rodapeCard = document.createElement('div');
        rodapeCard.className = 'rodape-card';

        const preco = document.createElement('span');
        preco.className = 'preco-produto';
        preco.textContent = formatarPreco(produto.preco);

        const botaoVer = document.createElement('button');
        botaoVer.type = 'button';
        botaoVer.className = 'btn-ver-produto';
        botaoVer.textContent = 'Ver';

        botaoVer.setAttribute(
            'aria-label',
            `Ver detalhes de ${produto.nome}`
        );

        /*
         * Não consulta nem altera o banco.
         *
         * Apenas guarda o ID selecionado para que
         * a ligação com produto.html seja feita depois.
         */
        botaoVer.addEventListener('click', () => {
            sessionStorage.setItem(
                'produto_selecionado',
                String(produto.id)
            );
        });

        if (produto.qtdEstoque <= 0) {
            botaoVer.disabled = true;
            botaoVer.textContent = 'Esgotado';

            botaoVer.setAttribute(
                'aria-label',
                `${produto.nome} está esgotado`
            );
        }

        rodapeCard.appendChild(preco);
        rodapeCard.appendChild(botaoVer);

        conteudo.appendChild(titulo);
        conteudo.appendChild(descricao);
        conteudo.appendChild(rodapeCard);

        card.appendChild(areaImagem);
        card.appendChild(conteudo);

        return card;
    }

    /**
     * Cria os botões das categorias usando
     * as categorias reais recebidas do backend.
     */
    function renderizarCategorias() {
        listaCategorias.innerHTML = '';

        const categorias = [
            ...new Set(
                produtos
                    .map((produto) => produto.categoria)
                    .filter(Boolean)
            )
        ].sort((categoriaA, categoriaB) => {
            return categoriaA.localeCompare(
                categoriaB,
                'pt-BR'
            );
        });

        const todasCategorias = [
            'Todos',
            ...categorias
        ];

        todasCategorias.forEach((categoria) => {
            const botao = document.createElement('button');

            botao.type = 'button';
            botao.className = 'categoria';
            botao.dataset.categoria = categoria;
            botao.textContent = categoria;

            const estaSelecionada =
                categoria === categoriaSelecionada;

            botao.classList.toggle(
                'ativa',
                estaSelecionada
            );

            botao.setAttribute(
                'aria-pressed',
                String(estaSelecionada)
            );

            botao.addEventListener('click', () => {
                categoriaSelecionada = categoria;

                document
                    .querySelectorAll('.categoria')
                    .forEach((item) => {
                        const estaAtivo =
                            item === botao;

                        item.classList.toggle(
                            'ativa',
                            estaAtivo
                        );

                        item.setAttribute(
                            'aria-pressed',
                            String(estaAtivo)
                        );
                    });

                renderizarProdutos();
            });

            listaCategorias.appendChild(botao);
        });
    }

    /**
     * Configura o preço máximo com base
     * no maior preço existente no banco.
     */
    function configurarFiltroPreco() {
        if (produtos.length === 0) {
            filtroPreco.min = '0';
            filtroPreco.max = '0';
            filtroPreco.value = '0';

            valorPreco.textContent =
                formatarPreco(0);

            return;
        }

        const maiorPreco = Math.max(
            ...produtos.map((produto) => produto.preco)
        );

        const limiteArredondado =
            Math.ceil(maiorPreco / 10) * 10;

        filtroPreco.min = '0';
        filtroPreco.max =
            String(limiteArredondado);

        filtroPreco.value =
            String(limiteArredondado);

        valorPreco.textContent =
            formatarPreco(limiteArredondado);
    }

    /**
     * Aplica os filtros do front-end sobre
     * os produtos recebidos do banco.
     */
    function filtrarProdutos() {
        const busca = normalizarTexto(
            campoBusca.value
        );

        const precoMaximo =
            Number(filtroPreco.value);

        return produtos.filter((produto) => {
            const textoProduto =
                normalizarTexto(
                    `${produto.nome} ${produto.descricao} ${produto.categoria}`
                );

            const correspondeBusca =
                textoProduto.includes(busca);

            const correspondeCategoria =
                categoriaSelecionada === 'Todos' ||
                produto.categoria === categoriaSelecionada;

            const correspondePreco =
                produto.preco <= precoMaximo;

            return (
                correspondeBusca &&
                correspondeCategoria &&
                correspondePreco
            );
        });
    }

    /**
     * Mostra os produtos na tela.
     */
    function renderizarProdutos() {
        const produtosFiltrados =
            filtrarProdutos();

        gradeProdutos.innerHTML = '';

        if (produtosFiltrados.length === 0) {
            const mensagem = criarMensagem(
                'mensagem-vazia',
                'Nenhum produto encontrado.',
                'Tente alterar a busca, a categoria ou o preço máximo.'
            );

            gradeProdutos.appendChild(mensagem);
        } else {
            produtosFiltrados.forEach((produto) => {
                const card =
                    criarCardProduto(produto);

                gradeProdutos.appendChild(card);
            });
        }

        resultadoFiltros.textContent =
            `${produtosFiltrados.length} produto(s) encontrado(s).`;
    }

    /**
     * Busca os produtos reais do backend.
     */
    async function carregarProdutos() {
        mostrarCarregamento();

        try {
            const resposta = await fetch(
                ENDPOINT_PRODUTOS,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    },

                    /*
                     * Permite que a sessão do usuário
                     * seja enviada quando ela for criada.
                     */
                    credentials: 'same-origin'
                }
            );

            if (!resposta.ok) {
                throw new Error(
                    `O servidor retornou o status ${resposta.status}.`
                );
            }

            const dados = await resposta.json();

            /*
             * Aceita tanto um array:
             *
             * [
             *     {...},
             *     {...}
             * ]
             *
             * quanto uma página do Spring:
             *
             * {
             *     "content": [...]
             * }
             */
            const listaRecebida =
                Array.isArray(dados)
                    ? dados
                    : dados.content;

            if (!Array.isArray(listaRecebida)) {
                throw new Error(
                    'O servidor não retornou uma lista de produtos válida.'
                );
            }

            produtos = listaRecebida.map(
                normalizarProduto
            );

            renderizarCategorias();
            configurarFiltroPreco();
            renderizarProdutos();
        } catch (erro) {
            console.error(
                'Erro ao carregar produtos:',
                erro
            );

            mostrarErro(
                'Verifique se o backend está ligado e se o endpoint de produtos está correto.'
            );
        }
    }

    campoBusca.addEventListener(
        'input',
        renderizarProdutos
    );

    filtroPreco.addEventListener('input', () => {
        valorPreco.textContent =
            formatarPreco(
                Number(filtroPreco.value)
            );

        renderizarProdutos();
    });

    carregarProdutos();
});

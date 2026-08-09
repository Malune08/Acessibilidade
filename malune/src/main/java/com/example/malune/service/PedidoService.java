package com.example.malune.service;

import com.example.malune.dto.CartaoDTO;
import com.example.malune.dto.ItemPedidoDTO;
import com.example.malune.dto.PedidoDTO;
import com.example.malune.dto.PedidoResponseDTO;
import com.example.malune.entity.*;
import com.example.malune.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@AllArgsConstructor
@Service
public class PedidoService {

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final EntregaRepository entregaRepository;
    private final CartaoRepository cartaoRepository;
    private final PagamentoRepository pagamentoRepository;

    @Transactional
    public PedidoResponseDTO confirmarPedido(Integer idUsuario, PedidoDTO dto) {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (usuario.getEndereco() == null) {
            throw new RuntimeException("Usuário não tem endereço cadastrado.");
        }

        // 1. Calcula o total buscando o preço real de cada produto no banco
        BigDecimal valorTotal = BigDecimal.ZERO;
        for (ItemPedidoDTO item : dto.getItens()) {
            Produto produto = produtoRepository.findById(item.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + item.getIdProduto()));
            valorTotal = valorTotal.add(produto.getValorUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())));
        }

        // 2. Cria o Pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setValorTotal(valorTotal);
        pedido = pedidoRepository.save(pedido);

        // 3. Cria os Itens do Pedido (agora que o pedido já tem id)
        for (ItemPedidoDTO item : dto.getItens()) {
            Produto produto = produtoRepository.findById(item.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + item.getIdProduto()));

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            itemPedido.setProduto(produto);
            itemPedido.setValorUnitario(produto.getValorUnitario());
            itemPedido.setQuantidade(item.getQuantidade());
            itemPedidoRepository.save(itemPedido);
        }

        // 4. Cria a Entrega usando o endereço já salvo do usuário
        Entrega entrega = new Entrega();
        entrega.setPedido(pedido);
        entrega.setEndereco(usuario.getEndereco());
        entrega.setDataEstimada(LocalDate.now().plusDays(7));
        entregaRepository.save(entrega);

        // 5. Resolve o cartão, se for pagamento por cartão
        if (dto.getFormaPagamento() == FormaPagamento.CARTAO) {
            if (dto.getCartaoId() == null && dto.getCartaoNovo() == null) {
                throw new RuntimeException("Nenhum cartão informado para pagamento com cartão.");
            }
            if (dto.getCartaoId() != null) {
                cartaoRepository.findById(dto.getCartaoId())
                        .orElseThrow(() -> new RuntimeException("Cartão não encontrado."));
            } else {
                criarCartao(usuario, dto.getCartaoNovo());
            }
        }

        // 6. Cria o Pagamento (simulação: sorteia aprovado ou recusado, 90% de chance de aprovar)
        boolean aprovado = new Random().nextBoolean();

        Pagamento pagamento = new Pagamento();
        pagamento.setPedido(pedido);
        pagamento.setFormaPagamento(dto.getFormaPagamento());
        pagamento.setStatus(aprovado ? StatusPagamento.APROVADO : StatusPagamento.RECUSADO);
        pagamento.setDataPagamento(LocalDate.now());
        pagamento = pagamentoRepository.save(pagamento);

        // 7. Atualiza o status do pedido: confirmado se aprovou, continua aguardando se recusou
        pedido.setStatus(aprovado ? StatusPedido.CONFIRMADO : StatusPedido.AGUARDANDO);
        pedidoRepository.save(pedido);

        return new PedidoResponseDTO(pedido.getId(), pagamento.getId(), pagamento.getStatus().name());
    }

    private void criarCartao(Usuario usuario, CartaoDTO dto) {
        Cartao cartao = new Cartao();
        cartao.setUsuario(usuario);
        cartao.setNome(dto.getNome());
        cartao.setNumeroCartao(dto.getNumero());
        cartao.setTipoCartao(dto.getTipo());
        cartao.setDataValidade(converterValidade(dto.getValidade()));
        cartaoRepository.save(cartao);
    }

    private LocalDate converterValidade(String validade) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
        YearMonth yearMonth = YearMonth.parse(validade, formatter);
        return yearMonth.atEndOfMonth();
    }
}
package com.example.malune.service;

import com.example.malune.dto.CarrinhoResponseDTO;
import com.example.malune.dto.ItemCarrinhoDTO;
import com.example.malune.dto.ItemCarrinhoResponseDTO;
import com.example.malune.entity.Carrinho;
import com.example.malune.entity.ItemCarrinho;
import com.example.malune.entity.Produto;
import com.example.malune.entity.Usuario;
import com.example.malune.repository.CarrinhoRepository;
import com.example.malune.repository.ItemCarrinhoRepository;
import com.example.malune.repository.ProdutoRepository;
import com.example.malune.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@Service
public class CarrinhoService {

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final CarrinhoRepository carrinhoRepository;
    private final ItemCarrinhoRepository itemCarrinhoRepository;

    @Transactional(readOnly = true)
    public CarrinhoResponseDTO buscarCarrinho(Integer idUsuario) {
        Usuario usuario = buscarUsuario(idUsuario);
        return carrinhoRepository.findByUsuario(usuario)
                .map(this::paraResposta)
                .orElseGet(() -> new CarrinhoResponseDTO(List.of(), BigDecimal.ZERO));
    }

    @Transactional
    public CarrinhoResponseDTO adicionarItem(Integer idUsuario, ItemCarrinhoDTO dto) {
        Usuario usuario = buscarUsuario(idUsuario);
        Produto produto = buscarProduto(dto.getIdProduto());
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario).orElseGet(() -> criarCarrinho(usuario));

        ItemCarrinho item = itemCarrinhoRepository.findByCarrinhoAndProduto(carrinho, produto)
                .orElseGet(() -> criarItem(carrinho, produto));
        int novaQuantidade = item.getQuantidade() + dto.getQuantidade();
        validarEstoque(produto, novaQuantidade);
        item.setQuantidade(novaQuantidade);
        itemCarrinhoRepository.save(item);

        return paraResposta(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO atualizarQuantidade(Integer idUsuario, Integer idProduto, ItemCarrinhoDTO dto) {
        Usuario usuario = buscarUsuario(idUsuario);
        Produto produto = buscarProduto(idProduto);
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrinho não encontrado."));
        ItemCarrinho item = itemCarrinhoRepository.findByCarrinhoAndProduto(carrinho, produto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado no carrinho."));

        validarEstoque(produto, dto.getQuantidade());
        item.setQuantidade(dto.getQuantidade());
        itemCarrinhoRepository.save(item);

        return paraResposta(carrinho);
    }

    @Transactional
    public void removerItem(Integer idUsuario, Integer idProduto) {
        Usuario usuario = buscarUsuario(idUsuario);
        Produto produto = buscarProduto(idProduto);
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrinho não encontrado."));
        ItemCarrinho item = itemCarrinhoRepository.findByCarrinhoAndProduto(carrinho, produto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado no carrinho."));

        itemCarrinhoRepository.delete(item);
    }

    @Transactional
    public void limparCarrinho(Integer idUsuario) {
        Usuario usuario = buscarUsuario(idUsuario);
        carrinhoRepository.findByUsuario(usuario).ifPresent(carrinho ->
                itemCarrinhoRepository.deleteAll(itemCarrinhoRepository.findByCarrinho(carrinho))
        );
    }

    private Usuario buscarUsuario(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    private Produto buscarProduto(Integer idProduto) {
        return produtoRepository.findById(idProduto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));
    }

    private Carrinho criarCarrinho(Usuario usuario) {
        Carrinho carrinho = new Carrinho();
        carrinho.setUsuario(usuario);
        return carrinhoRepository.save(carrinho);
    }

    private ItemCarrinho criarItem(Carrinho carrinho, Produto produto) {
        ItemCarrinho item = new ItemCarrinho();
        item.setCarrinho(carrinho);
        item.setProduto(produto);
        item.setQuantidade(0);
        return item;
    }

    private void validarEstoque(Produto produto, int quantidade) {
        if (produto.getQtdEstoque() == null || quantidade > produto.getQtdEstoque()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade solicitada indisponível em estoque.");
        }
    }

    private CarrinhoResponseDTO paraResposta(Carrinho carrinho) {
        List<ItemCarrinhoResponseDTO> itens = itemCarrinhoRepository.findByCarrinho(carrinho).stream()
                .map(this::paraItemResposta)
                .toList();
        BigDecimal total = itens.stream()
                .map(ItemCarrinhoResponseDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CarrinhoResponseDTO(itens, total);
    }

    private ItemCarrinhoResponseDTO paraItemResposta(ItemCarrinho item) {
        Produto produto = item.getProduto();
        BigDecimal subtotal = produto.getValorUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()));
        return new ItemCarrinhoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getImagem(),
                produto.getValorUnitario(),
                item.getQuantidade(),
                subtotal
        );
    }
}

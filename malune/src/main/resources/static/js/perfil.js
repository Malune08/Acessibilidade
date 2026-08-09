document.addEventListener('DOMContentLoaded', () => {
    const CHAVE_PERFIL = 'perfil_usuario';
    const formulario = document.getElementById('form-perfil');
    const mensagem = document.getElementById('mensagem-perfil');
    const campos = ['nome', 'email', 'cpf', 'telefone'];
    const perfilSalvo = JSON.parse(localStorage.getItem(CHAVE_PERFIL) ?? '{}');

    campos.forEach((campo) => {
        document.getElementById(campo).value = perfilSalvo[campo] ?? '';
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const dados = Object.fromEntries(new FormData(formulario));

        localStorage.setItem(CHAVE_PERFIL, JSON.stringify(dados));
        mensagem.textContent = 'Dados salvos neste dispositivo.';
    });
});

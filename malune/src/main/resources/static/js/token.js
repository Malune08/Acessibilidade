document.addEventListener('DOMContentLoaded', () => {

    // l[ogica do back
    document
        .getElementById('formCodigo')
        .addEventListener('submit', async (event) => {

            event.preventDefault();

            const email =
                sessionStorage.getItem(
                    'email_recuperacao'
                );

            const token =
                document.getElementById('token').value;

            const response = await fetch(
                '/recuperacao-senha/validar',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        token: token
                    })
                }
            );

            const mensagem = await response.text();

            if (!response.ok) {
                alert(mensagem);
                return;
            }

            sessionStorage.setItem(
                'token_recuperacao',
                token
            );

            window.location.href =
                '/nova-senha.html';
        });
});
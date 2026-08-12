document.addEventListener('DOMContentLoaded', () => {

    // parte com a lógica do back
    document
        .getElementById('formEsqueciSenha')
        .addEventListener('submit', async (event) => {

            event.preventDefault();

            const email =
                document.getElementById('email').value;

            const response = await fetch(
                '/recuperacao-senha/solicitar',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            const mensagem = await response.text();

            if (!response.ok) {
                alert(mensagem);
                return;
            }

            sessionStorage.setItem(
                'email_recuperacao',
                email
            );

            window.location.href =
                '/token.html';
        });
});
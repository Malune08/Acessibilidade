package com.example.malune.util;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class Email {

    @Value("${mail.username}")
    private String emailOrigem;

    @Value("${mail.password}")
    private String senhaApp;

    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final String SMTP_PORT = "587";

    public boolean enviarTokenRecuperacao(
            String emailDestino,
            String token
    ) {

        try {

            Properties props = new Properties();

            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", SMTP_HOST);
            props.put("mail.smtp.port", SMTP_PORT);

            Session session = Session.getInstance(
                    props,
                    new Authenticator() {

                        @Override
                        protected PasswordAuthentication
                        getPasswordAuthentication() {

                            return new PasswordAuthentication(
                                    emailOrigem,
                                    senhaApp
                            );
                        }
                    }
            );

            Message message = new MimeMessage(session);

            message.setFrom(
                    new InternetAddress(emailOrigem)
            );

            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(emailDestino)
            );

            message.setSubject(
                    "Código de Recuperação de Senha - Malune"
            );

            String corpoEmail = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>

                <body style="margin:0; padding:0; background:#fff8e8; font-family:Arial, sans-serif; color:#242424;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" border="0"
                           style="background:#fff8e8; padding:32px 16px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" border="0"
                                       style="max-width:520px; background:#ffffff; border:2px solid #91c6f4; border-radius:18px; overflow:hidden;">

                                    <tr>
                                        <td align="center" style="padding:26px 24px 18px; border-bottom:2px solid #9be83f;">
                                            <img
                                                src="https://raw.githubusercontent.com/Malune08/Acessibilidade/main/malune/src/main/resources/static/images/logomalune.png"
                                                alt="Logo Malune"
                                                style="width:170px; height:auto; display:block; margin:0 auto;"
                                            >

                                            <p style="margin:8px 0 0; color:#666666; font-size:14px;">
                                                Vamos brincar juntos
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:32px 34px; text-align:center;">
                                            <h1 style="margin:0 0 12px; font-size:24px; color:#242424;">
                                                Recuperação de senha
                                            </h1>

                                            <p style="margin:0 0 10px; font-size:16px; line-height:1.5; color:#555555;">
                                                Recebemos uma solicitação para redefinir sua senha.
                                            </p>

                                            <p style="margin:0; font-size:16px; line-height:1.5; color:#555555;">
                                                Use o código abaixo para continuar:
                                            </p>

                                            <div style="margin:26px auto; padding:16px 20px; max-width:260px; background:#ff4fa2; border-radius:12px; color:#ffffff; font-size:32px; font-weight:700; letter-spacing:8px;">
                                                %s
                                            </div>

                                            <p style="margin:0; padding:12px 16px; background:#edf7ff; border-radius:10px; font-size:14px; line-height:1.5; color:#4a4a4a;">
                                                ⏰ Este código expira em <strong>2 horas</strong>.
                                            </p>

                                            <p style="margin:22px 0 0; font-size:13px; line-height:1.5; color:#777777;">
                                                Se você não solicitou a recuperação de senha, ignore este e-mail.
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="padding:16px 24px; background:#91c6f4; color:#ffffff; font-size:12px;">
                                            © Malune — Diversão que colore a infância
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(token);

            message.setContent(
                    corpoEmail,
                    "text/html; charset=utf-8"
            );

            Transport.send(message);

            System.out.println("E-mail enviado para: " + emailDestino);

            return true;

        } catch (MessagingException e) {

            System.out.println("Erro ao enviar e-mail!");
            e.printStackTrace();
            return false;
        }
    }
}
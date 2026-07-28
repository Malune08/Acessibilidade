package com.example.malune.util;

public final class RegexPatterns {

    private RegexPatterns() {} // impede instanciar essa classe

    public static final String CARTAO = "^[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}$";
    public static final String CEP = "^[0-9]{5}[\\-]?[0-9]{3}$";
    public static final String CPF = "^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?[0-9]{2}$";
    public static final String DT_NASC = "^(0[1-9]|(1|2)[0-9]|3[0-1])[\\.\\-\\/]?(0[1-9]|1[0-2])[\\.\\-\\/]?([0-9]{4}|[0-9]{2})$";
    public static final String EMAIL = "^(?!.*[.\\-]{2})[a-zA-Z0-9]+(?:[.\\-+][a-zA-Z0-9]+)*@(?!.*[.\\-]{2})[a-zA-Z0-9]+(?:[.\\-][a-zA-Z0-9]+)*\\.[a-zA-Z]{2,}$";
    public static final String NOME_USUARIO = "^(?!.*[._\\-]{2})[a-zA-Z0-9_](?:[a-zA-Z0-9_.\\-]{0,28}[a-zA-Z0-9_])?$";
    public static final String SENHA = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&_\\-!\\+=\\?.,:;\\/|\\\"\\'\\(\\)\\[\\]\\{\\}\\^~])[a-zA-Z0-9@#$%&_\\-!\\+=\\?.,:;\\/|\\\"\\'\\(\\)\\[\\]\\{\\}\\^~]{8,16}$";
    public static final String TELEFONE = "^(\\([0-9]{2}\\)|[0-9]{2})[\\- ]?[0-9]{5}[\\.\\- ]?[0-9]{4}$";
}
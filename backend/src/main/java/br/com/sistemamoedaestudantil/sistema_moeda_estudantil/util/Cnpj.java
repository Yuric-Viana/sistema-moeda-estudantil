package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util;

import java.util.regex.Pattern;

public final class Cnpj {

    private static final Pattern FORMATO = Pattern.compile("^\\d{2}\\.?\\d{3}\\.?\\d{3}/?\\d{4}-?\\d{2}$");
    private static final int[] PESOS_PRIMEIRO = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] PESOS_SEGUNDO = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    private Cnpj() {
    }

    public static boolean valido(String valor) {
        if (valor == null || !FORMATO.matcher(valor.trim()).matches()) {
            return false;
        }
        String numeros = somenteNumeros(valor);
        if (numeros.chars().distinct().count() == 1) {
            return false;
        }
        return calcularDigito(numeros, PESOS_PRIMEIRO) == numeros.charAt(12) - '0'
                && calcularDigito(numeros, PESOS_SEGUNDO) == numeros.charAt(13) - '0';
    }

    public static String formatar(String valor) {
        String n = somenteNumeros(valor);
        return n.substring(0, 2) + "." + n.substring(2, 5) + "." + n.substring(5, 8)
                + "/" + n.substring(8, 12) + "-" + n.substring(12);
    }

    private static String somenteNumeros(String valor) {
        return valor.replaceAll("\\D", "");
    }

    private static int calcularDigito(String numeros, int[] pesos) {
        int soma = 0;
        for (int i = 0; i < pesos.length; i++) {
            soma += (numeros.charAt(i) - '0') * pesos[i];
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}

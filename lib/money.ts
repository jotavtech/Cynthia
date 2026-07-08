export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatMoney(value: number | string) {
  return currencyFormatter.format(Number(value));
}

/**
 * Converte um valor monetario (com no maximo 2 casas) para centavos inteiros.
 * Toda a aritmetica de dinheiro deve ser feita em centavos para evitar erros de
 * ponto flutuante; so voltamos para reais na exibicao/persistencia.
 */
export function toCents(value: number | string): number {
  return Math.round(Number(value) * 100);
}

/** Converte centavos inteiros de volta para reais (numero com 2 casas). */
export function fromCents(cents: number): number {
  return cents / 100;
}

/** Formata centavos inteiros como string decimal "0.00" para persistir no banco. */
export function centsToDecimalString(cents: number): string {
  return (cents / 100).toFixed(2);
}

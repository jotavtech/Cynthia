export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatMoney(value: number | string) {
  return currencyFormatter.format(Number(value));
}

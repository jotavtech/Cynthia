type CartMessageItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export function buildWhatsappCartMessage(items: CartMessageItem[]) {
  const lines = items.map((item) => {
    const total = item.quantity * item.unitPrice;

    return `${item.quantity}x ${item.name} - ${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total)}`;
  });

  return [
    "Ola! Tenho interesse nos seguintes produtos:",
    "",
    ...lines,
    "",
    "Meu nome:",
    "Meu telefone:",
    "Forma de entrega:",
    "Observacoes:",
  ].join("\n");
}

export function buildWhatsappUrl(phone: string, message: string) {
  const normalizedPhone = phone.replace(/\D/g, "");

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

import { CartView } from "@/components/cart/cart-view";

export const metadata = {
  title: "Carrinho",
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h1 className="mb-8 text-3xl font-semibold text-stone-950">Carrinho</h1>
      <CartView />
    </main>
  );
}

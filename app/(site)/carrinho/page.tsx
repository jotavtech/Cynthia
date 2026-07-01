import { getSiteSettings } from "@/lib/settings";
import { CartView } from "@/components/cart/cart-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Carrinho",
};

export default async function CartPage() {
  const settings = await getSiteSettings();
  const whatsapp = settings?.whatsapp ?? process.env.STORE_WHATSAPP ?? "";

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h1 className="mb-8 text-3xl font-semibold text-stone-950">Carrinho</h1>
      <CartView whatsapp={whatsapp} />
    </main>
  );
}

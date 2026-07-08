export const metadata = {
  title: "Sobre",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
        Sobre
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-stone-950">
        Cynthia Makes
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-8 text-stone-700">
        <p>
          A Cynthia Makes nasceu para tornar a compra de maquiagem mais simples
          e proxima. Selecionamos produtos com cuidado e oferecemos um
          atendimento direto pelo WhatsApp.
        </p>
        <p>
          Cada item do catalogo passa por curadoria para garantir qualidade e
          uma experiencia de compra clara, do estoque ate a finalizacao do
          pedido.
        </p>
      </div>
    </main>
  );
}

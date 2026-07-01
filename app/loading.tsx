export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div
        className="size-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900"
        role="status"
        aria-label="Carregando"
      />
    </div>
  );
}

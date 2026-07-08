"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-stone-950">
          Algo deu errado
        </h1>
        <p className="mt-4 text-stone-600">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <Button className="mt-8" onClick={() => reset()}>
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}

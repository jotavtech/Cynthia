"use client";

import { Trash2 } from "lucide-react";

import { deleteProductAction } from "@/lib/actions/products";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!confirm(`Desativar o produto "${name}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
        aria-label={`Desativar ${name}`}
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}

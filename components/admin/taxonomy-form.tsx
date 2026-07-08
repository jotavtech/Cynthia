"use client";

import { useActionState } from "react";

import type { TaxonomyFormState } from "@/lib/actions/taxonomy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TaxonomyAction = (
  prevState: TaxonomyFormState,
  formData: FormData,
) => Promise<TaxonomyFormState>;

export function TaxonomyForm({
  action,
  entityLabel,
}: {
  action: TaxonomyAction;
  entityLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4 rounded-lg border bg-white p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descricao (opcional)</Label>
        <Textarea id="description" name="description" rows={2} />
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="isActive" defaultChecked />
        Ativa
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-600">Salvo com sucesso.</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : `Adicionar ${entityLabel}`}
      </Button>
    </form>
  );
}

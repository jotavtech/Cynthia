"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  saveProductAction,
  type ProductFormState,
} from "@/lib/actions/products";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Option = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name?: string;
  description?: string;
  price?: string;
  compareAtPrice?: string | null;
  sku?: string | null;
  stock?: number;
  lowStockThreshold?: number;
  categoryId?: string;
  brandId?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
};

const initialState: ProductFormState = {};

const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600">{message}</p>;
}

export function ProductForm({
  categories,
  brands,
  defaultValues = {},
}: {
  categories: Option[];
  brands: Option[];
  defaultValues?: ProductFormValues;
}) {
  const [state, formAction, pending] = useActionState(
    saveProductAction,
    initialState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      {defaultValues.id ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}

      {state.error ? (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-5 rounded-lg border bg-white p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" defaultValue={defaultValues.name} required />
          <FieldError message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descricao</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={defaultValues.description}
            required
          />
          <FieldError message={errors.description} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Preco (R$)</Label>
            <Input
              id="price"
              name="price"
              inputMode="decimal"
              placeholder="59.90"
              defaultValue={defaultValues.price}
              required
            />
            <FieldError message={errors.price} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="compareAtPrice">Preco comparativo (opcional)</Label>
            <Input
              id="compareAtPrice"
              name="compareAtPrice"
              inputMode="decimal"
              placeholder="79.90"
              defaultValue={defaultValues.compareAtPrice ?? ""}
            />
            <FieldError message={errors.compareAtPrice} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU (opcional)</Label>
            <Input id="sku" name="sku" defaultValue={defaultValues.sku ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Estoque</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min={0}
              defaultValue={defaultValues.stock ?? 0}
              required
            />
            <FieldError message={errors.stock} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Alerta de estoque</Label>
            <Input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min={0}
              defaultValue={defaultValues.lowStockThreshold ?? 5}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <select
              id="categoryId"
              name="categoryId"
              className={fieldClass}
              defaultValue={defaultValues.categoryId ?? ""}
              required
            >
              <option value="" disabled>
                Selecione
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.categoryId} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandId">Marca (opcional)</Label>
            <select
              id="brandId"
              name="brandId"
              className={fieldClass}
              defaultValue={defaultValues.brandId ?? ""}
            >
              <option value="">Sem marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Imagem (JPG, PNG ou WEBP, ate 5 MB)</Label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-stone-950 file:px-3 file:py-2 file:text-sm file:text-white"
          />
          <p className="text-xs text-stone-500">
            Enviar uma imagem adiciona ao produto (opcional na edicao).
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={defaultValues.isActive ?? true}
            />
            Ativo
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={defaultValues.isFeatured ?? false}
            />
            Destaque
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              name="isNew"
              defaultChecked={defaultValues.isNew ?? false}
            />
            Novidade
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar produto"}
        </Button>
        <Link
          href="/admin/produtos"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

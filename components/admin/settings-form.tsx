"use client";

import { useActionState } from "react";

import {
  saveSettingsAction,
  type SettingsFormState,
} from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type SettingsValues = {
  storeName: string;
  whatsapp: string;
  instagram: string | null;
  email: string | null;
  address: string | null;
  businessHours: string | null;
  homeHeroTitle: string;
  homeHeroDescription: string;
  seoTitle: string;
  seoDescription: string;
  whatsappDefaultMessage: string;
};

const initialState: SettingsFormState = {};

function Field({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
      />
    </div>
  );
}

export function SettingsForm({ values }: { values: SettingsValues }) {
  const [state, formAction, pending] = useActionState(
    saveSettingsAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <fieldset className="grid gap-5 rounded-lg border bg-white p-6">
        <legend className="px-2 text-sm font-medium text-stone-500">
          Loja e contato
        </legend>
        <Field name="storeName" label="Nome da loja" defaultValue={values.storeName} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="whatsapp" label="WhatsApp (com DDI)" defaultValue={values.whatsapp} required />
          <Field name="instagram" label="Instagram" defaultValue={values.instagram} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="email" label="Email" defaultValue={values.email} />
          <Field name="businessHours" label="Horario de atendimento" defaultValue={values.businessHours} />
        </div>
        <Field name="address" label="Endereco" defaultValue={values.address} />
      </fieldset>

      <fieldset className="grid gap-5 rounded-lg border bg-white p-6">
        <legend className="px-2 text-sm font-medium text-stone-500">
          Home e SEO
        </legend>
        <Field name="homeHeroTitle" label="Titulo da home" defaultValue={values.homeHeroTitle} required />
        <div className="space-y-2">
          <Label htmlFor="homeHeroDescription">Descricao da home</Label>
          <Textarea
            id="homeHeroDescription"
            name="homeHeroDescription"
            rows={3}
            defaultValue={values.homeHeroDescription}
            required
          />
        </div>
        <Field name="seoTitle" label="SEO: titulo" defaultValue={values.seoTitle} required />
        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO: descricao</Label>
          <Textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={values.seoDescription}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsappDefaultMessage">Mensagem padrao do WhatsApp</Label>
          <Textarea
            id="whatsappDefaultMessage"
            name="whatsappDefaultMessage"
            rows={2}
            defaultValue={values.whatsappDefaultMessage}
            required
          />
        </div>
      </fieldset>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-600">Configuracoes salvas.</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar configuracoes"}
      </Button>
    </form>
  );
}

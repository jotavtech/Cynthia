import { getSiteSettings } from "@/lib/settings";
import { SettingsForm, type SettingsValues } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

const defaults: SettingsValues = {
  storeName: "Cynthia Makes",
  whatsapp: "",
  instagram: null,
  email: null,
  address: null,
  businessHours: null,
  homeHeroTitle: "Beleza escolhida com cuidado",
  homeHeroDescription:
    "Uma curadoria de maquiagem para realcar sua rotina com qualidade e atendimento proximo.",
  seoTitle: "Cynthia Makes | Maquiagem e beleza",
  seoDescription:
    "Catalogo de maquiagem Cynthia Makes com atendimento pelo WhatsApp.",
  whatsappDefaultMessage:
    "Ola! Vim pelo site da Cynthia Makes e quero ajuda para escolher meus produtos.",
};

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  const values: SettingsValues = settings
    ? {
        storeName: settings.storeName,
        whatsapp: settings.whatsapp,
        instagram: settings.instagram,
        email: settings.email,
        address: settings.address,
        businessHours: settings.businessHours,
        homeHeroTitle: settings.homeHeroTitle,
        homeHeroDescription: settings.homeHeroDescription,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        whatsappDefaultMessage: settings.whatsappDefaultMessage,
      }
    : defaults;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-950">Configuracoes</h1>
        <p className="mt-1 text-sm text-stone-500">
          Dados da loja usados no site publico.
        </p>
      </div>

      <SettingsForm values={values} />
    </div>
  );
}

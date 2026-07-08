import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/components/cart/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cynthiamakes.com.br"),
  title: {
    default: "Cynthia Makes | Maquiagem e beleza",
    template: "%s | Cynthia Makes",
  },
  description:
    "Catalogo de maquiagem Cynthia Makes com curadoria, atendimento proximo e finalizacao pelo WhatsApp.",
  openGraph: {
    title: "Cynthia Makes",
    description:
      "Catalogo de maquiagem com curadoria, atendimento proximo e compra facil pelo WhatsApp.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

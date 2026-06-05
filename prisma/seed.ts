import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const storeWhatsapp = process.env.STORE_WHATSAPP ?? "5500000000000";
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL in environment.");
  }

  if (adminPassword && adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must have at least 12 characters.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    if (adminEmail && adminPassword) {
      const passwordHash = await hash(adminPassword, 12);

      await prisma.user.upsert({
        where: { email: adminEmail },
        update: { passwordHash, isActive: true },
        create: {
          email: adminEmail,
          passwordHash,
          role: "ADMIN",
          isActive: true,
        },
      });
    }

    const categories = [
      {
        name: "Maquiagem para Pele",
        slug: "maquiagem-para-pele",
        description: "Bases, corretivos, pos e produtos para acabamento.",
      },
      {
        name: "Labios",
        slug: "labios",
        description: "Batons, glosses e lapis labiais.",
      },
      {
        name: "Olhos",
        slug: "olhos",
        description: "Sombras, mascaras, delineadores e lapis.",
      },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }

    const brands = [
      { name: "Cynthia Makes", slug: "cynthia-makes" },
      { name: "Linha Profissional", slug: "linha-profissional" },
    ];

    for (const brand of brands) {
      await prisma.brand.upsert({
        where: { slug: brand.slug },
        update: brand,
        create: brand,
      });
    }

    const skinCategory = await prisma.category.findUniqueOrThrow({
      where: { slug: "maquiagem-para-pele" },
    });
    const lipsCategory = await prisma.category.findUniqueOrThrow({
      where: { slug: "labios" },
    });
    const cynthiaBrand = await prisma.brand.findUniqueOrThrow({
      where: { slug: "cynthia-makes" },
    });

    const products = [
      {
        name: "Base Liquida Soft Matte",
        slug: "base-liquida-soft-matte",
        description: "Base de acabamento matte para uma pele uniforme.",
        price: "59.90",
        sku: "CM-BASE-SOFT-MATTE",
        stock: 12,
        isFeatured: true,
        isNew: true,
        categoryId: skinCategory.id,
        brandId: cynthiaBrand.id,
      },
      {
        name: "Batom Nude Conforto",
        slug: "batom-nude-conforto",
        description: "Batom nude cremoso para uso diario.",
        price: "34.90",
        sku: "CM-BATOM-NUDE",
        stock: 18,
        isFeatured: true,
        isNew: false,
        categoryId: lipsCategory.id,
        brandId: cynthiaBrand.id,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });
    }

    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        whatsapp: storeWhatsapp,
      },
      create: {
        id: "default",
        storeName: "Cynthia Makes",
        whatsapp: storeWhatsapp,
        instagram: "https://instagram.com/",
        homeHeroTitle: "Beleza escolhida com cuidado",
        homeHeroDescription:
          "Uma curadoria de maquiagem para realcar sua rotina com qualidade, atendimento proximo e compra facil pelo WhatsApp.",
        seoTitle: "Cynthia Makes | Maquiagem e beleza",
        seoDescription:
          "Catalogo de maquiagem Cynthia Makes com atendimento pelo WhatsApp.",
        whatsappDefaultMessage:
          "Ola! Vim pelo site da Cynthia Makes e quero ajuda para escolher meus produtos.",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

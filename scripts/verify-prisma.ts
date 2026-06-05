import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  const [categoryCount, productCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
  ]);

  console.log(
    `✅ Connected. Categories: ${categoryCount}. Products: ${productCount}.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

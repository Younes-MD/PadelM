import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BRANDS = ["Adidas", "Babolat", "Bullpadel", "Head", "Nox", "StarVie", "Varlion", "Wilson"];

async function main() {
  for (const name of BRANDS) {
    await prisma.brand.upsert({
      where: { name },
      update: {},
      create: { name, active: true },
    });
  }
  console.log("✅ Brands seeded:", BRANDS.join(", "));
}

main().finally(() => prisma.$disconnect());
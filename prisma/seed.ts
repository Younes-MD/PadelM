import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "changeme123!",
    12
  );

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || "admin",
      password: hashedPassword,
    },
  });

  // Seed sample rackets
  const rackets = [
    {
      title: "Bullpadel Hack 03 2024",
      brand: "Bullpadel",
      model: "Hack 03",
      condition: "like_new",
      price: 185,
      description:
        "Top-tier power racket from Bullpadel's 2024 lineup. Carbon frame with MultiEva rubber. Used for only 3 months — no scratches, original grip intact. Ideal for advanced players seeking maximum power.",
      images: [],
      weight: "365g",
      shape: "diamond",
      featured: true,
    },
    {
      title: "Head Extreme Motion 2023",
      brand: "Head",
      model: "Extreme Motion",
      condition: "good",
      price: 95,
      description:
        "Versatile all-round racket with Graphene 360+ technology. Well-maintained with minor cosmetic wear on the frame edges. Great intermediate option with excellent sweet spot.",
      images: [],
      weight: "355g",
      shape: "round",
      featured: true,
    },
    {
      title: "Adidas Metalbone 3.3",
      brand: "Adidas",
      model: "Metalbone 3.3",
      condition: "like_new",
      price: 210,
      description:
        "Ale Galán signature racket. Aluminized carbon with Eva Soft Performance rubber. Barely used — bought as backup. Perfect for players who want control with power potential.",
      images: [],
      weight: "370g",
      shape: "diamond",
      featured: true,
    },
    {
      title: "Nox ML10 Pro Cup",
      brand: "Nox",
      model: "ML10 Pro Cup",
      condition: "good",
      price: 120,
      description:
        "Miguel Lamperti signature model. HR3 carbon surface with soft EVA rubber. Played with for about 6 months, minor surface scratches. Outstanding control-oriented racket.",
      images: [],
      weight: "360g",
      shape: "round",
      featured: false,
    },
    {
      title: "Babolat Viper Air",
      brand: "Babolat",
      model: "Viper Air",
      condition: "fair",
      price: 65,
      description:
        "Lightweight power racket with visible wear marks on edges and small paint chip. Core and frame are fully intact. Excellent entry point for players wanting to try a premium shape.",
      images: [],
      weight: "345g",
      shape: "diamond",
      featured: false,
    },
    {
      title: "Wilson Bela Pro V2",
      brand: "Wilson",
      model: "Bela Pro V2",
      condition: "like_new",
      price: 175,
      description:
        "Fernando Belasteguin signature. Slim Throat Design with Hybrid Performance EVA. Used only a handful of times. Premium craftsmanship and pinpoint control.",
      images: [],
      weight: "365g",
      shape: "teardrop",
      featured: true,
    },
  ];

  for (const racket of rackets) {
    await prisma.racket.create({ data: racket });
  }

  console.log("✅ Database seeded successfully");
  console.log(`   Admin user: ${process.env.ADMIN_USERNAME || "admin"}`);
  console.log(`   ${rackets.length} sample rackets created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

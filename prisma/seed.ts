import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed Admin - Use strong password for production
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);

  await prisma.admin.upsert({
    where: { username: process.env.ADMIN_USERNAME || "admin" },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || "admin",
      password: hashedPassword,
      name: "Administrator",
    },
  });

  // Clear existing products first
  await prisma.product.deleteMany({});

  // Create products
  await prisma.product.createMany({
    data: products,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

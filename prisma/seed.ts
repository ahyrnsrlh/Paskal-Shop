import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Seed Admin
  const hashedPassword = await bcrypt.hash("admin123", 10)

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
    },
  })

  // Seed Products
  const products = [
    {
      name: "iPhone 15 Pro",
      description: "Latest iPhone with A17 Pro chip and titanium design",
      price: 15999000,
      stock: 25,
      category: "Electronics",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "MacBook Air M3",
      description: "Powerful laptop with M3 chip and all-day battery life",
      price: 18999000,
      stock: 15,
      category: "Electronics",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Nike Air Max 270",
      description: "Comfortable running shoes with Air Max technology",
      price: 2199000,
      stock: 50,
      category: "Fashion",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Samsung Galaxy S24",
      description: "Flagship Android phone with AI features",
      price: 12999000,
      stock: 30,
      category: "Electronics",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Adidas Ultraboost 22",
      description: "Premium running shoes with Boost technology",
      price: 2799000,
      stock: 40,
      category: "Fashion",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Sony WH-1000XM5",
      description: "Industry-leading noise canceling headphones",
      price: 4999000,
      stock: 20,
      category: "Electronics",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  // Clear existing products first
  await prisma.product.deleteMany({})

  // Create products
  await prisma.product.createMany({
    data: products,
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

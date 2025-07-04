import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true }
  })

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${process.env.NEXTAUTH_URL}/products/${product.id}`,
    lastModified: product.updatedAt,
  }))

  return [
    {
      url: `${process.env.NEXTAUTH_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${process.env.NEXTAUTH_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...productEntries,
  ]
}

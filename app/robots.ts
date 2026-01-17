import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.reworkcare.com' // 실제 운영 도메인

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

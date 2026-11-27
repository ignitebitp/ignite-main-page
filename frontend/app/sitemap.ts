import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mainDomain = 'https://www.igniteclub.tech';
  const vercelDomain = 'https://ignitebitp.vercel.app';
  const lastModified = new Date();

  const mainPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/events', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/recruit', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/team', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/alumni', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/gallery', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/inginiux', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/exam', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/attend', priority: 0.5, changeFrequency: 'weekly' as const },
    { path: '/login', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/register', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  const subdomains = [
    { url: 'https://bitpesports.igniteclub.tech', priority: 0.85, changeFrequency: 'weekly' as const },
  ];

  const mainEntries: MetadataRoute.Sitemap = mainPages.map(page => ({
    url: `${mainDomain}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const subdomainEntries: MetadataRoute.Sitemap = subdomains.map(sub => ({
    url: sub.url,
    lastModified,
    changeFrequency: sub.changeFrequency,
    priority: sub.priority,
  }));

  const vercelMirrorEntries: MetadataRoute.Sitemap = mainPages.map(page => ({
    url: `${vercelDomain}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: Number((page.priority * 0.9).toFixed(2)),
  }));

  return [...mainEntries, ...subdomainEntries, ...vercelMirrorEntries];
}

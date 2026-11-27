import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mainDomain = 'https://ignitebitp.in';
  const vercelDomain = 'https://ignite-technical-innovation-club.vercel.app';
  const lastModified = new Date();

  // Core main site routes
  const mainPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/events', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/recruit', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/team', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/gallery', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/inginiux', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/developers', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/exam', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/attend', priority: 0.5, changeFrequency: 'weekly' as const },
    { path: '/login', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/register', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  // Subdomains to regulate and index
  const subdomains = [
    // Esports Subdomain
    { url: 'https://esports.ignitebitp.in', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: 'https://esports.ignitebitp.in/team', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: 'https://esports.ignitebitp.in/tournaments', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: 'https://esports.ignitebitp.in/register', priority: 0.8, changeFrequency: 'weekly' as const },

    // Inginiux Annual Flagship Fest Subdomain
    { url: 'https://inginiux.ignitebitp.in', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: 'https://inginiux.ignitebitp.in/hackathon', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: 'https://inginiux.ignitebitp.in/events', priority: 0.85, changeFrequency: 'daily' as const },
    { url: 'https://inginiux.ignitebitp.in/schedule', priority: 0.8, changeFrequency: 'weekly' as const },

    // Assessment & Recruitment Nodes
    { url: 'https://exam.ignitebitp.in', priority: 0.75, changeFrequency: 'weekly' as const },
    { url: 'https://recruit.ignitebitp.in', priority: 0.9, changeFrequency: 'daily' as const },
    { url: 'https://events.ignitebitp.in', priority: 0.85, changeFrequency: 'daily' as const },
    { url: 'https://portal.ignitebitp.in', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: 'https://admin.ignitebitp.in', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const mainEntries: MetadataRoute.Sitemap = mainPages.map(page => ({
    url: `${mainDomain}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const vercelMirrorEntries: MetadataRoute.Sitemap = mainPages.map(page => ({
    url: `${vercelDomain}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: Number((page.priority * 0.9).toFixed(2)),
  }));

  const subdomainEntries: MetadataRoute.Sitemap = subdomains.map(sub => ({
    url: sub.url,
    lastModified,
    changeFrequency: sub.changeFrequency,
    priority: sub.priority,
  }));

  return [...mainEntries, ...subdomainEntries, ...vercelMirrorEntries];
}

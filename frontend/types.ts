export interface TeamMember {
  name: string;
  post: string;
  role: string;
  image: string;
  socials: {
    linkedin?: string;
    website?: string;
  };
}

export interface AlumniMember {
  name: string;
  batch: string;
  image: string;
  linkedin?: string;
  website?: string;
}

export interface AboutUsData {
  clubName: string;
  societySubtitle: string;
  established: string;
  campus: string;
  eyebrow: string;
  headline: string;
  shortDescription: string;
  heroDescription: string;
  mission: { title: string; summary: string };
  vision: { title: string; summary: string };
  story: string[];
  stats: { label: string; value: string; tag: string }[];
  pillars: { title: string; description: string; badge: string }[];
}

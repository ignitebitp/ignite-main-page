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

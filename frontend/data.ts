import { TeamMember, AlumniMember, AboutUsData } from './types';
import teamSectionJson from './data/team-section.json';
import alumniSectionJson from './data/alumni-section.json';
import aboutUsJson from './data/about-us.json';

export const ABOUT_US = aboutUsJson as AboutUsData;

export const TEAM_SECTION = teamSectionJson as {
  executiveBoard: TeamMember[];
  coreTechnicalTeam: TeamMember[];
  members: TeamMember[];
};

export const ALUMNI_SECTION = alumniSectionJson as Record<
  string,
  Omit<AlumniMember, 'batch'>[]
>;

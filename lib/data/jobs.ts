export interface Job {
  id: string;
  company: string;
  logo?: string;
  role: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  remote: boolean;
  salary?: string;
  description: string;
  tags?: string[];
  href: string;
  postedAt: string; // ISO date
}

export const JOBS: Job[] = [];

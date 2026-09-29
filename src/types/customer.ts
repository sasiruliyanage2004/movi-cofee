export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  totalVisits: number;
  lastVisitAt?: string | null;
  preferredSeating?: string | null;
  dietaryNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  phone: string;
  email?: string;
  dietaryNotes?: string;
}

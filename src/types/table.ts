import { SeatingArea } from "./reservation";

export interface CafeTable {
  id: string;
  tableNumber: string; // e.g. "T-01", "C-04"
  capacity: number;
  seatingArea: SeatingArea;
  isAvailable: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

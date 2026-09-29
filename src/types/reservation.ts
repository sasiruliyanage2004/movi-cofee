export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
  | "seated";

export type SeatingArea = "salon" | "courtyard" | "communal" | "quiet-nook" | "any";

export interface Reservation {
  id: string;
  referenceNumber: string; // e.g. MC-7824
  customerId?: string;
  guestName: string;
  phone: string;
  email?: string;
  reservationDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  guestsCount: number;
  tableId?: string | null;
  tableNumber?: string | null;
  seatingArea: SeatingArea;
  specialRequest?: string;
  specialNotes?: string;
  status: ReservationStatus;
  createdAt: string; // ISO string
  updatedAt: string;
}

export interface CreateReservationInput {
  guestName: string;
  phone: string;
  email?: string;
  reservationDate: string;
  timeSlot: string;
  guestsCount: number;
  tableId?: string | null;
  seatingArea?: SeatingArea;
  specialRequest?: string;
  specialNotes?: string;
}

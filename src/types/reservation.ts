export type ReservationStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled";

export type SeatingArea = "salon" | "courtyard" | "communal" | "quiet-nook" | "any";

export interface Reservation {
  id: string;
  referenceNumber: string; // e.g. MC-7824
  guestName: string;
  email: string;
  phone: string;
  guestsCount: number;
  reservationDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  seatingArea: SeatingArea;
  specialNotes?: string;
  status: ReservationStatus;
  createdAt: string; // ISO string
  updatedAt: string;
}

export interface CreateReservationInput {
  guestName: string;
  email: string;
  phone: string;
  guestsCount: number;
  reservationDate: string;
  timeSlot: string;
  seatingArea: SeatingArea;
  specialNotes?: string;
}

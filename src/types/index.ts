export type UserRole = "patient" | "doctor" | "staff";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  fullName(): string;
  initials(): string;
}

export interface IStorable<T> {
  save(value: T): void;
  load(): T | null;
  clear(): void;
}

export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  jmbg?: string;
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  allergies?: string[];
  chronicConditions?: string[];
  city?: string;
  country?: string;
  cardId: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  bio: string;
  rating: number;
  reviews: number;
  experienceYears: number;
  price: number;
  photoUrl?: string;
  availableToday: boolean;
  workplace: string;
  languages: string[];
}

export type AppointmentType = "Redovan pregled" | "Kontrolni pregled" | "Konsultacija";

export type AppointmentStatus = "zakazan" | "obavljen" | "otkazan";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: AppointmentType;
  durationMin: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export type RecordStatus = "Normalan" | "Uredan" | "Proveriti" | "Abnormalan";

export type RecordType =
  | "Krvna slika"
  | "EKG"
  | "RTG"
  | "Hormonski panel"
  | "Ultrazvuk"
  | "MRI"
  | "Urin"
  | "Drugo";

export interface MedicalRecord {
  id: string;
  title: string;
  type: RecordType;
  doctorName: string;
  date: string;
  status: RecordStatus;
  summary?: string;
  fileUrl?: string;
}

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
}

export interface RandomApiUser {
  name: { first: string; last: string };
  email: string;
  picture: { large: string; medium: string; thumbnail: string };
  location: { city: string; country: string };
  login: { uuid: string };
}

// Fix: Define all necessary types for the application.
export type Page =
  | "home"
  | "register"
  | "login"
  | "dashboard"
  | "berita"
  | "agenda"
  | "forum"
  | "kadin360"
  | "eventDetails"
  | "directory"
  | "forgotPassword"
  | "admin";

export type RegistrationType =
  | "Daftar Baru"
  | "Perpanjang KTA"
  | "Registrasi Ulang";

export type MembershipType = "Anggota Biasa (AB)" | "Anggota Luar Biasa (ALB)";

export type NotificationType = "success" | "warning" | "info" | "error";

export interface AppNotification {
  id: number;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
}

export type DashboardTab =
  | "profil"
  | "perusahaan"
  | "anggota"
  | "pembayaran"
  | "pengaturan";

export interface KadinEvent {
  id: string;
  date: string;
  year: string;
  title: string;
  location: string;
  description: string;
  details: string;
  schedule: { time: string; activity: string }[];
  registrationFee: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  materialsUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
}

export interface MemberProfile {
  id: number;
  name: string;
  company: string;
  industry: string;
  location: string;
  avatarUrl: string;
  joinedYear: number;
  email: string;
  ktaNumber?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

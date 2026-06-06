export interface Patient {
  id: string; // e.g. #PT-2024-001 or RM-2023-0812
  name: string;
  gender: "Laki-laki" | "Perempuan";
  age: string; // e.g., "45th" or "45 Thn"
  address: string;
  phone?: string;
  status: "Inpatient" | "Outpatient" | "Critical" | "Discharged";
  registeredDate: string;
}

export interface Visit {
  id: string; // e.g., RM-2023-0812
  patientId: string;
  patientName: string;
  gender: "Laki-laki" | "Perempuan";
  age: string;
  time: string; // e.g., "08:45 WIB"
  poliklinik:
    | "Poli Umum"
    | "Poli Gigi"
    | "Poli Anak"
    | "Poli Penyakit Dalam"
    | "Poli Kandungan"
    | "Check Up Rutin";
  doctor: string; // e.g., "Dr. Andi Pratama"
  status:
    | "Antri"
    | "Pemeriksaan"
    | "Selesai"
    | "Menunggu"
    | "Gawat"
    | "Diperiksa";
  date: string; // "2023-10-24" or standard YYYY-MM-DD
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "urgent" | "info";
  time: string;
}

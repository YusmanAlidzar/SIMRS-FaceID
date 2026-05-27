import { Patient, Visit, NotificationItem } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "#PT-2024-001",
    name: "Agus Budiman",
    gender: "Laki-laki",
    age: "45th",
    address: "Jl. Merdeka No. 12, Kelurahan Melati, Jakarta Pusat",
    phone: "0812-3456-7890",
    status: "Inpatient",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2024-002",
    name: "Siti Wahyuni",
    gender: "Perempuan",
    age: "28th",
    address: "Perum Citra Indah Blok A/12, Jonggol, Bogor",
    phone: "0856-7890-1234",
    status: "Outpatient",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2024-003",
    name: "Budi Kusuma",
    gender: "Laki-laki",
    age: "62th",
    address: "Jl. Gajah Mada No. 88, Semarang",
    phone: "0813-5791-3579",
    status: "Critical",
    registeredDate: "2023-10-23"
  },
  {
    id: "#PT-2024-004",
    name: "Endah Lestari",
    gender: "Perempuan",
    age: "35th",
    address: "Apartemen Green Bay Tower B, Lt. 12, Pluit",
    phone: "0899-7654-3210",
    status: "Discharged",
    registeredDate: "2023-10-22"
  },
  {
    id: "#PT-2024-005",
    name: "Rian Aditya",
    gender: "Laki-laki",
    age: "19th",
    address: "Jl. Kenanga No. 5, Sleman, Yogyakarta",
    phone: "0877-6543-2109",
    status: "Inpatient",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2023-010",
    name: "Bambang Wijaya",
    gender: "Laki-laki",
    age: "50th",
    address: "Kebayoran Lama No. 4, Jakarta Selatan",
    phone: "0812-9988-7766",
    status: "Inpatient",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2023-011",
    name: "Siti Aminah",
    gender: "Perempuan",
    age: "28th",
    address: "Jl. Mawar No. 45, Bandung",
    phone: "0821-3456-9999",
    status: "Outpatient",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2023-012",
    name: "Rizky Pratama",
    gender: "Laki-laki",
    age: "31th",
    address: "Jl. Sudirman No. 102, Palembang",
    phone: "0811-2233-4455",
    status: "Critical",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2023-013",
    name: "Ani Sulastri",
    gender: "Perempuan",
    age: "8th",
    address: "Perum Indah Sakti Blok F/8, Bekasi",
    phone: "0852-1122-3344",
    status: "Outpatient",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2023-014",
    name: "Budi Santoso",
    gender: "Laki-laki",
    age: "45th",
    address: "Jl. Diponegoro No. 89, Surabaya",
    phone: "0812-8877-6655",
    status: "Discharged",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2023-015",
    name: "Ahmad Hidayat",
    gender: "Laki-laki",
    age: "52th",
    address: "Jl. Veteran Baru No. 12, Semarang",
    phone: "0838-1234-5678",
    status: "Inpatient",
    registeredDate: "2023-10-24"
  },
  {
    id: "#PT-2023-016",
    name: "Rina Melati",
    gender: "Perempuan",
    age: "34th",
    address: "Duren Sawit Indah Blok C2, Jakarta Timur",
    phone: "0812-9090-8080",
    status: "Outpatient",
    registeredDate: "2023-10-24"
  }
];

export const INITIAL_VISITS: Visit[] = [
  // Current active visits or day visits matching mock stats and tables
  {
    id: "RM-2023-0812",
    patientId: "#PT-2023-010",
    patientName: "Bambang Wijaya",
    gender: "Laki-laki",
    age: "50 Thn",
    time: "08:45 WIB",
    poliklinik: "Poli Penyakit Dalam",
    doctor: "Dr. Herman Susilo",
    status: "Antri",
    date: "2023-10-24"
  },
  {
    id: "RM-2023-0799",
    patientId: "#PT-2023-011",
    patientName: "Siti Aminah",
    gender: "Perempuan",
    age: "28 Thn",
    time: "09:12 WIB",
    poliklinik: "Poli Kandungan",
    doctor: "Drg. Larasati", // Wait, Siti Aminah is at Poli Kandungan under Dr. Sarah Wijaya in some sense, or Drg. Larasati at Poli Gigi. We can use what's shown!
    status: "Diperiksa",
    date: "2023-10-24"
  },
  {
    id: "RM-2023-0815",
    patientId: "#PT-2023-012",
    patientName: "Rizky Pratama",
    gender: "Laki-laki",
    age: "31 Thn",
    time: "09:30 WIB",
    poliklinik: "UGD",
    doctor: "Dr. Andi Pratama",
    status: "Gawat",
    date: "2023-10-24"
  },
  {
    id: "RM-2023-0820",
    patientId: "#PT-2023-013",
    patientName: "Ani Sulastri",
    gender: "Perempuan",
    age: "8 Thn",
    time: "10:05 WIB",
    poliklinik: "Poli Anak",
    doctor: "Dr. Andi Pratama",
    status: "Antri",
    date: "2023-10-24"
  },
  // Kunjungan Harian page items (additional matches from first mockup)
  {
    id: "RM-2023-00124",
    patientId: "#PT-2023-014",
    patientName: "Budi Santoso",
    gender: "Laki-laki",
    age: "45 Thn",
    time: "08:15 WIB",
    poliklinik: "Poli Umum",
    doctor: "Dr. Andi Pratama",
    status: "Selesai",
    date: "2023-10-24"
  },
  {
    id: "RM-2023-00125",
    patientId: "#PT-2023-011",
    patientName: "Siti Aminah",
    gender: "Perempuan",
    age: "28 Thn",
    time: "09:30 WIB",
    poliklinik: "Poli Gigi",
    doctor: "Drg. Larasati",
    status: "Pemeriksaan",
    date: "2023-10-24"
  },
  {
    id: "RM-2023-00126",
    patientId: "#PT-2023-015",
    patientName: "Ahmad Hidayat",
    gender: "Laki-laki",
    age: "52 Thn",
    time: "10:05 WIB",
    poliklinik: "Poli Penyakit Dalam",
    doctor: "Dr. Herman Susilo",
    status: "Menunggu",
    date: "2023-10-24"
  },
  {
    id: "RM-2023-00127",
    patientId: "#PT-2023-016",
    patientName: "Rina Melati",
    gender: "Perempuan",
    age: "34 Thn",
    time: "10:15 WIB",
    poliklinik: "Poli Umum",
    doctor: "Dr. Andi Pratama",
    status: "Menunggu",
    date: "2023-10-24"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Stok Obat Menipis",
    description: "Paracetamol 500mg di Farmasi sisa 50 strip.",
    type: "urgent",
    time: "10m ago"
  },
  {
    id: "notif-2",
    title: "Maintenance SIMRS",
    description: "Pukul 23:00 WIB malam ini ada pemeliharaan rutin.",
    type: "info",
    time: "2h ago"
  }
];

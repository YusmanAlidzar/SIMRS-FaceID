export type ScreenType =
  | "INITIAL_WELCOME" // Welcome Screen - 1280x1024 - Updated Logo Variant (Final)
  | "METHOD_CHOICE"    // Welcome Screen - 1280x1024 - Final Logo Variant (Login vs Signin)
  | "LOGIN_CHOICE"     // 3c9a2b94ccde4f3981bb933f31ad53f5 (Mulai scan vs Isi Manual)
  | "MANUAL_FORM"      // Identity Form - Fully Editable Granular Variant (1280x1024)
  | "REGISTER_FORM"    // 5235786872820070475 (Sign up form with "pilih face id" button)
  | "FACE_REGISTRATION" // 7a85a81089394822ab14f01b1e85b991 (Face ID scanner stage)
  | "REGISTRATION_REVIEW" // 7822b0fa6fbe40e5a20eabe51b6907e8 (Form data + Photo review)
  | "GENERAL_FACE_SCAN" // Face Scan Screen - 1280x1024 - Updated Logo Variant
  | "TICKET_CONFIRMATION" // Confirmation Screen A001 - Fully Editable Element Variant Layout
  | "SUCCESS_PAGE"     // 6affa4dfe148421686c7e89a13f65e5f (Selesai success page with printed ticket)
  | "PSIKIATRI_WELCOME"; // 7d7f55f956ed44b99921818bba3a3d6b (Psikiatri special welcome screen)

export interface PatientInfo {
  nama: string;
  nik: string;
  tanggalLahir: string;
  jenisKelamin: string;
  telepon: string;
  alamat: string;
  photoUrl?: string;
  poly: string;
  dokter: string;
}

export interface Poliklinik {
  id: string;
  name: string;
  code: string;
  dokter: string;
  icon: string;
  description: string;
}

export const POLIKLINIK_LIST: Poliklinik[] = [
  {
    id: "poly-umum",
    name: "Poli Umum",
    code: "UMM",
    dokter: "dr. H. Ahmad Fauzi, M.Kes",
    icon: "Stethoscope",
    description: "Pemeriksaan umum dan penanganan keluhan pertama pasien.",
  },
  {
    id: "poly-anak",
    name: "Poli Anak",
    code: "ANK",
    dokter: "dr. Andi Wijaya, Sp.A",
    icon: "Baby",
    description: "Spesialis kesehatan bayi, anak-anak, dan tumbuh kembang.",
  },
  {
    id: "poly-kandungan",
    name: "Poli Kandungan",
    code: "OBG",
    dokter: "dr. Maria Ulfa, Sp.OG",
    icon: "HeartPulse",
    description: "Pemeriksaan kehamilan, kesehatan reproduksi, dan janin.",
  },
  {
    id: "poly-penyakit-dalam",
    name: "Poli Penyakit Dalam",
    code: "PDL",
    dokter: "dr. Budi Setiawan, Sp.PD",
    icon: "ShieldAlert",
    description: "Penanganan penyakit organ dalam lambung, paru-paru, dll.",
  },
  {
    id: "poly-jantung",
    name: "Poli Jantung",
    code: "JNT",
    dokter: "dr. Siska Amelia, Sp.JP",
    icon: "Activity",
    description: "Layanan spesialis diagnosis dan terapi jantung & pembuluh darah.",
  },
  {
    id: "poly-orthopedi",
    name: "Poli Orthopedi",
    code: "ORT",
    dokter: "dr. Hendra Pratama, Sp.OT",
    icon: "Bone",
    description: "Perawatan cedera tulang, sendi, otot, dan ligamen rangka.",
  },
  {
    id: "poly-saraf",
    name: "Poli Saraf",
    code: "SRF",
    dokter: "dr. Rian Hidayat, Sp.N",
    icon: "Brain",
    description: "Diagnosis dan penanganan gangguan otak, saraf, dan sumsum.",
  },
  {
    id: "poly-gigi",
    name: "Poli Gigi",
    code: "GIG",
    dokter: "drg. Fitria Lestari",
    icon: "Smile",
    description: "Pelayanan kebersihan mulut, gigi berlubang, dan ortodonsi.",
  },
  {
    id: "poly-mata",
    name: "Poli Mata",
    code: "MAT",
    dokter: "dr. Yusuf Hamdan, Sp.M",
    icon: "Eye",
    description: "Spesialisasi gangguan penglihatan, katarak, dan kacamata.",
  },
  {
    id: "poly-tht",
    name: "Poli THT",
    code: "THT",
    dokter: "dr. Dina Mariana, Sp.THT-KL",
    icon: "Ear",
    description: "Pemeriksaan hidung, tenggorokan, dan fungsi pendengaran.",
  },
  {
    id: "poly-kulit",
    name: "Poli Kulit & Kelamin",
    code: "KK",
    dokter: "dr. Susan Anggraini, Sp.DV",
    icon: "Sparkles",
    description: "Layanan terapi kecantikan kulit, alergi, dan infeksi luar.",
  },
  {
    id: "poly-psikiatri",
    name: "Poli Psikiatri",
    code: "PSI",
    dokter: "dr. Ridwan Chaniago, Sp.KJ",
    icon: "HeartHandshake",
    description: "Konsultasi kesehatan jiwa, konseling stress, dan depresi.",
  },
];

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Save, UserCheck, Calendar, Info } from "lucide-react";
import { Poliklinik, PatientInfo } from "../types";
import Header from "./Header";

interface IdentityFormProps {
  selectedPoly: Poliklinik | null;
  mode: "MANUAL_LOGIN" | "REGISTER";
  initialData: PatientInfo;
  onBack: () => void;
  onSubmit: (data: PatientInfo) => void;
  onGoToFaceScan?: (data: PatientInfo) => void;
}

export default function IdentityForm({
  selectedPoly,
  mode,
  initialData,
  onBack,
  onSubmit,
  onGoToFaceScan,
}: IdentityFormProps) {
  const [formData, setFormData] = useState<PatientInfo>({
    ...initialData,
    poly: selectedPoly ? selectedPoly.name : "Umum",
    dokter: selectedPoly ? selectedPoly.dokter : "dr. H. Ahmad Fauzi, M.Kes",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PatientInfo, string>>>({});

  // Field validator
  const validate = () => {
    const newErrors: Partial<Record<keyof PatientInfo, string>> = {};
    if (!formData.nama.trim()) newErrors.nama = "Nama lengkap wajib diisi";
    if (!formData.nik.trim() || formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      newErrors.nik = "NIK harus terdiri dari 16 digit angka";
    }
    if (!formData.tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir wajib dipilih";
    if (formData.jenisKelamin === "" || formData.jenisKelamin === "Pilih Jenis Kelamin") {
      newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    }
    if (!formData.telepon.trim() || formData.telepon.length < 10) {
      newErrors.telepon = "Nomor telepon tidak valid";
    }
    if (!formData.alamat.trim()) newErrors.alamat = "Alamat lengkap wajib diisi";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PatientInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleFaceScanTransition = () => {
    if (!validate()) return;
    if (onGoToFaceScan) {
      onGoToFaceScan(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10" id="identity-form-screen">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between">
        
        {/* Header toolbar */}
        <Header 
          selectedPoly={selectedPoly} 
          onReset={onBack}
          rightElement={
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full text-xs font-semibold hover:bg-slate-50 transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="font-display">Kembali</span>
            </button>
          }
        />

        {/* Input Form Body */}
        <div className="my-auto py-4 space-y-6 text-left" id="form-container">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4" id="form-header-title">
            <div className="space-y-1">
              <span className="p-1 px-2.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold rounded-full font-display">
                PASIEN {mode === "MANUAL_LOGIN" ? "TERDAFTAR (MANUAL)" : "BARU"}
              </span>
              <h2 className="text-2xl font-black font-display text-slate-800">
                {mode === "MANUAL_LOGIN" ? "Ketik Identitas Pasien" : "Registrasi Akun Baru"}
              </h2>
              <p className="text-slate-400 text-xs font-sans">
                Lengkapi formulir identitas di bawah ini untuk memperoleh struk antrean pelayanan klinis.
              </p>
            </div>

            {/* Selected Location info panel */}
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-3 max-w-[280px]">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase leading-none">POLI TUJUAN:</span>
                <span className="text-xs font-bold text-slate-800 truncate leading-normal mt-0.5">{selectedPoly ? selectedPoly.name : "Poli Umum"}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" id="patient-registration-form">
            
            {/* Input 1: Nama Lengkap */}
            <div className="space-y-1.5" id="form-group-nama">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-display select-none">
                Nama Lengkap Sesuai KTP <span className="text-rose-500 font-bold">*</span>
              </label>
              <input 
                type="text"
                name="nama"
                placeholder="Masukkan nama sesuai KTP"
                value={formData.nama}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-hidden text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/10 transition-all ${
                  errors.nama ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-teal-500"
                }`}
                id="input-form-nama"
              />
              {errors.nama && <p className="text-[10px] font-semibold text-rose-500 font-sans mt-1">{errors.nama}</p>}
            </div>

            {/* Input 2: NIK */}
            <div className="space-y-1.5" id="form-group-nik">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-display select-none">
                NIK (Nomor Induk Kependudukan) <span className="text-rose-500 font-bold">*</span>
              </label>
              <input 
                type="text"
                name="nik"
                maxLength={16}
                placeholder="16 digit nomor identitas"
                value={formData.nik}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-hidden text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/10 transition-all font-mono ${
                  errors.nik ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-teal-500"
                }`}
                id="input-form-nik"
              />
              {errors.nik && <p className="text-[10px] font-semibold text-rose-500 font-sans mt-1">{errors.nik}</p>}
            </div>

            {/* Input 3: Tanggal Lahir */}
            <div className="space-y-1.5" id="form-group-tanggalLahir">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-display select-none">
                Tanggal Lahir Pasien <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input 
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-hidden text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/10 transition-all ${
                    errors.tanggalLahir ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-teal-500"
                  }`}
                  id="input-form-tanggal-lahir"
                />
              </div>
              {errors.tanggalLahir && <p className="text-[10px] font-semibold text-rose-500 font-sans mt-1">{errors.tanggalLahir}</p>}
            </div>

            {/* Input 4: Jenis Kelamin */}
            <div className="space-y-1.5" id="form-group-jenisKelamin">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-display select-none">
                Jenis Kelamin <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-hidden text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/10 transition-all ${
                  errors.jenisKelamin ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-teal-500"
                }`}
                id="select-form-jenis-kelamin"
              >
                <option>Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki (L)</option>
                <option value="Perempuan">Perempuan (P)</option>
              </select>
              {errors.jenisKelamin && <p className="text-[10px] font-semibold text-rose-500 font-sans mt-1">{errors.jenisKelamin}</p>}
            </div>

            {/* Input 5: Nomor Telepon */}
            <div className="space-y-1.5" id="form-group-telepon">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-display select-none">
                Nomor Telepon Seluler <span className="text-rose-500 font-bold">*</span>
              </label>
              <input 
                type="tel"
                name="telepon"
                placeholder="Contoh: 0812XXXXXXXX"
                value={formData.telepon}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-hidden text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/10 transition-all font-mono ${
                  errors.telepon ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-teal-500"
                }`}
                id="input-form-telepon"
              />
              {errors.telepon && <p className="text-[10px] font-semibold text-rose-500 font-sans mt-1">{errors.telepon}</p>}
            </div>

            {/* Info warning banner */}
            <div className="flex bg-slate-50 border border-slate-150 rounded-2xl p-3.5 gap-2.5 items-start self-center" id="form-guideline-aside">
              <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium leading-relaxed text-slate-500">
                Data yang diisikan harus sesuai dengan data kependudukan resmi KTP/KK Anda agar tidak terjadi inkonsistensi saat sinkronisasi BPJS Kesehatan.
              </p>
            </div>

            {/* Input 6: Alamat Lengkap (Spans 2 columns) */}
            <div className="space-y-1.5 md:col-span-2" id="form-group-alamat">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-display select-none">
                Alamat Lengkap Domisili <span className="text-rose-500 font-bold">*</span>
              </label>
              <textarea 
                name="alamat"
                rows={3}
                placeholder="Masukkan alamat domisili saat ini..."
                value={formData.alamat}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-hidden text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/10 transition-all resize-none ${
                  errors.alamat ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-teal-500"
                }`}
                id="textarea-form-alamat"
              />
              {errors.alamat && <p className="text-[10px] font-semibold text-rose-500 font-sans mt-1">{errors.alamat}</p>}
            </div>

            {/* Form actions row */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:col-span-2 gap-4 mt-3" id="form-actions-wrapper">
              <button 
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-slate-300 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer text-center"
              >
                Batal
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Specific option if REGISTER MODE: allows Pilih Face ID */}
                {mode === "REGISTER" && (
                  <button 
                    type="button"
                    onClick={handleFaceScanTransition}
                    className="px-6 py-3 bg-cyan-50 text-cyan-700 border border-cyan-100 hover:bg-cyan-100 font-bold rounded-xl text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
                    id="btn-form-pilih-face-id"
                  >
                    <Camera className="w-4.5 h-4.5" />
                    <span>Pilih Face ID</span>
                  </button>
                )}

                {/* Primary Button */}
                <button 
                  type="submit"
                  className="px-8 py-3 bg-[#1B1B1B] text-white hover:bg-slate-800 font-bold rounded-xl text-sm transition cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                  id="btn-form-simpan-lanjutkan"
                >
                  <Save className="w-4.5 h-4.5" />
                  <span>Simpan & Lanjutkan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

              </div>
            </div>

          </form>
        </div>

        {/* Footer info text */}
        <footer className="w-full text-center text-xs text-slate-400 border-t border-slate-100 pt-6" id="form-footer">
          <p className="font-mono">SIMRSUD Secure Registrasi • Transmisi Data Menggunakan Enkripsi SSL 256-bit.</p>
        </footer>

      </div>
    </div>
  );
}

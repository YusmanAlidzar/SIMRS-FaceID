import React from "react";
import { ArrowLeft, Check, Camera, RefreshCw } from "lucide-react";
import { Poliklinik, PatientInfo } from "../types";
import Header from "./Header";
import { motion } from "motion/react";

interface RegistrationReviewProps {
  selectedPoly: Poliklinik | null;
  patientData: PatientInfo;
  onBack: () => void;
  onRetakeFacePhoto: () => void;
  onConfirm: () => void;
}

export default function RegistrationReview({
  selectedPoly,
  patientData,
  onBack,
  onRetakeFacePhoto,
  onConfirm,
}: RegistrationReviewProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10" id="reg-review-screen">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between">
        
        {/* Navigation Toolbar */}
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

        {/* Outer review canvas layout component */}
        <div className="my-auto py-6 space-y-8 text-left" id="reg-review-body">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-[10px] bg-indigo-50 border border-indigo-150 rounded-full text-indigo-700 p-1 px-2.5 font-bold tracking-wider font-mono">STEP 3 OF 4</span>
            <h2 className="text-2xl font-black font-display text-slate-900">Verifikasi Berkas & Wajah</h2>
            <p className="text-slate-400 text-xs">
              Mengevaluasi kesesuaian gambar biometris Face ID Anda dengan dokumen administratif RSUD kependudukan sebelum mencetak nomor antrean loket.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start" id="reg-review-layout-grid">
            
            {/* Left Col (Biometrics Card): 5 Columns */}
            <div className="md:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center text-center gap-5 relative overflow-hidden" id="raw-photo-review-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8"></div>
              
              <div className="w-full aspect-square rounded-2xl bg-slate-950 border-4 border-white shadow-md overflow-hidden relative">
                <img 
                  src={patientData.photoUrl} 
                  alt="Review biometrik wajah" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-x-[-1]"
                  id="target-biometric-snapshot"
                />
                
                {/* Visual success seal logo */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Check className="w-4.5 h-4.5 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm font-display uppercase tracking-wide">FOTO BIOMETRIK OK</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Struktur wajah Anda terekam dalam database lokal terenkripsi RSUD dengan integritas tinggi.
                </p>
              </div>

              {/* RETAKE trigger */}
              <button 
                type="button"
                onClick={onRetakeFacePhoto}
                className="w-full py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                id="btn-retake-face-photo"
              >
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Pilih Face ID Lagi / Re-Take</span>
              </button>
            </div>

            {/* Right Col: 7 Columns displays details table list */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden" id="fields-review-card">
              
              <div className="p-5.5 border-b border-slate-100 bg-slate-50/60 font-bold text-slate-800 text-sm font-display flex items-center gap-1.5 justify-between">
                <span>Informasi Rekam Medis</span>
                <span className="text-[10px] font-mono border px-1.5 py-0.5 rounded-sm bg-white border-slate-150 text-slate-500 font-medium">PENDING APPROVAL</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs" id="review-fields-table">
                {/* Name */}
                <div className="grid grid-cols-4 p-4.5 items-center gap-3">
                  <span className="text-slate-400 font-bold uppercase font-display">Nama Lengkap</span>
                  <span className="col-span-3 font-semibold text-slate-800 font-sans text-sm">{patientData.nama}</span>
                </div>

                {/* NIK */}
                <div className="grid grid-cols-4 p-4.5 items-center gap-3">
                  <span className="text-slate-400 font-bold uppercase font-display">No. NIK</span>
                  <span className="col-span-3 font-mono font-bold text-slate-800 text-sm tracking-wide">{patientData.nik}</span>
                </div>

                {/* TTL */}
                <div className="grid grid-cols-4 p-4.5 items-center gap-3">
                  <span className="text-slate-400 font-bold uppercase font-display">Tgl. Lahir</span>
                  <span className="col-span-3 font-semibold text-slate-800 font-mono text-sm">{patientData.tanggalLahir}</span>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-4 p-4.5 items-center gap-3">
                  <span className="text-slate-400 font-bold uppercase font-display">Kategori KB</span>
                  <span className="col-span-3 font-semibold text-slate-800">{patientData.jenisKelamin}</span>
                </div>

                {/* Telephone */}
                <div className="grid grid-cols-4 p-4.5 items-center gap-3">
                  <span className="text-slate-400 font-bold uppercase font-display">Nomor HP</span>
                  <span className="col-span-3 font-mono font-semibold text-slate-800 text-sm">{patientData.telepon}</span>
                </div>

                {/* Alamat */}
                <div className="grid grid-cols-4 p-4.5 gap-3">
                  <span className="text-slate-400 font-bold uppercase font-display">Alamat</span>
                  <span className="col-span-3 font-medium text-slate-500 leading-relaxed">{patientData.alamat}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Large Action Buttons row at the bottom right */}
          <div className="pt-4 border-t border-slate-150 flex items-center justify-between" id="reg-review-actions">
            <span className="text-[10px] text-slate-400 font-mono leading-none">KONFIRMASI AKHIR REGISTRASI MANDIRI</span>
            <button 
              onClick={onConfirm}
              className="px-8 py-4 bg-[#1B1B1B] text-white hover:bg-slate-800 rounded-full font-bold text-sm tracking-wide transition cursor-pointer flex items-center gap-2 shadow-md active:scale-[0.98]"
              id="btn-review-confirm-simpan"
            >
              <Check className="w-4.5 h-4.5 text-teal-400" />
              <span>Simpan & Konfirmasi Data</span>
            </button>
          </div>
        </div>

        {/* Footer legal disclaimer links */}
        <footer className="w-full text-center text-xs text-slate-400 border-t border-slate-100 pt-6" id="review-footer">
          <p className="font-mono">SIMRSUD Secure Registrasi • Transmisi Data Menggunakan Enkripsi SSL 256-bit.</p>
        </footer>

      </div>
    </div>
  );
}

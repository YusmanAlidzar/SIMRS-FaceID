import React from "react";
import { ArrowLeft, Scan, Keyboard, ShieldAlert, Sparkles } from "lucide-react";
import { Poliklinik } from "../types";
import Header from "./Header";

interface LoginChoiceScreenProps {
  selectedPoly: Poliklinik | null;
  onSelectFaceScan: () => void;
  onSelectManualInput: () => void;
  onBack: () => void;
}

export default function LoginChoiceScreen({
  selectedPoly,
  onSelectFaceScan,
  onSelectManualInput,
  onBack,
}: LoginChoiceScreenProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10" id="login-choice-screen">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between">
        
        {/* Header wrapper */}
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

        {/* Dynamic choice screen layout */}
        <div className="grid md:grid-cols-12 gap-8 my-auto py-8 items-center" id="login-choice-body">
          
          {/* Left panel: Info & instructions */}
          <div className="md:col-span-5 text-left space-y-6" id="login-choice-info-panel">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/50 rounded-full text-xs text-amber-800 font-display font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>LOG IN PASIEN TERDAFTAR</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight leading-tight">
                Bagaimana Anda <br />Ingin <span className="text-teal-600">Terautentikasi</span>?
              </h2>
              <p className="text-slate-500 font-sans text-sm leading-relaxed">
                Di RSUD SIMRSUD, kami memprioritaskan keamanan identitas klinis Anda. Gunakan sensor kamera Face ID untuk check-in instan, atau ketik data Anda secara manual jika terdapat kendala fisik/teknis kamera.
              </p>
            </div>

            {/* Micro-pointers to add premium health feels */}
            <div className="space-y-3 pt-2" id="micro-pointers">
              <div className="flex items-start gap-2.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                <span>Proses scan wajah memakan waktu kurang dari 3 detik.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                <span>Data biometrik dienkripsi aman secara lokal di server RSUD.</span>
              </div>
            </div>
          </div>

          {/* Right panel: Direct Buttons layout (Mulai vs Isi Manual) */}
          <div className="md:col-span-7 flex flex-col gap-5 text-left" id="login-choice-actions-panel">
            
            {/* BUTTON 1: Mulai Face ID (Scanner Trigger) */}
            <button 
              onClick={onSelectFaceScan}
              className="p-6.5 bg-[#1B1B1B] text-white hover:bg-slate-800 rounded-2xl cursor-pointer border border-transparent hover:shadow-lg active:scale-[0.99] transition flex items-center justify-between gap-4"
              id="btn-login-mulai-scan"
            >
              <div className="flex items-center gap-4.5">
                <div className="w-14 h-14 bg-teal-500/15 rounded-xl text-teal-400 flex items-center justify-center border border-teal-500/25">
                  <Scan className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-mono tracking-widest text-teal-400 font-bold block uppercase">REKOMENDASI</span>
                  <span className="text-lg font-bold font-display text-white">Mulai Scan Face ID</span>
                  <span className="text-xs text-slate-400 block font-sans">Hadapkan wajah lurus ke arah kamera Kiosk</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </button>

            {/* BUTTON 2: Isi Manual (Form Input Trigger) */}
            <button 
              onClick={onSelectManualInput}
              className="p-6.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer hover:shadow-md active:scale-[0.99] transition flex items-center justify-between gap-4"
              id="btn-login-isi-manual"
            >
              <div className="flex items-center gap-4.5">
                <div className="w-14 h-14 bg-slate-100 rounded-xl text-slate-600 flex items-center justify-center">
                  <Keyboard className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-mono tracking-widest text-slate-400 font-bold block uppercase">METODE CADANGAN</span>
                  <span className="text-lg font-bold font-display text-slate-800">Isi Formulir Manual</span>
                  <span className="text-xs text-slate-400 block font-sans">Ketik NIK dan detail identitas lengkap Anda di keyboard</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </button>

          </div>

        </div>

        {/* Footer */}
        <footer className="w-full text-center text-xs text-slate-400 border-t border-slate-100 pt-6" id="login-choice-footer">
          <p className="font-mono">Pemberitahuan: Sistem ini dilindungi demi privasi rekam medis pasien sesuai UU Kesehatan.</p>
        </footer>

      </div>
    </div>
  );
}
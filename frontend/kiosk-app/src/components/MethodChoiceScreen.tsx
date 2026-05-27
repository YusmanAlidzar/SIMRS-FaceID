import React from "react";
import { LogIn, UserPlus, ArrowLeft, Scan, ClipboardPen } from "lucide-react";
import { Poliklinik } from "../types";
import Header from "./Header";

interface MethodChoiceScreenProps {
  selectedPoly: Poliklinik | null;
  onSelectLogin: () => void;
  onSelectRegister: () => void;
  onBack: () => void;
}

export default function MethodChoiceScreen({
  selectedPoly,
  onSelectLogin,
  onSelectRegister,
  onBack,
}: MethodChoiceScreenProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10" id="method-choice-screen">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between">
        
        {/* Header with back navigation capability */}
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

        {/* Central Card Choices Layout */}
        <div className="my-auto py-10 space-y-10" id="choice-body">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight">
              Metode Autentikasi Kiosk
            </h2>
            <p className="text-sm font-sans text-slate-500 leading-relaxed">
              Pilih status keanggotaan Anda di RSUD SIMRSUD untuk melanjutkan registrasi pelayanan poli {selectedPoly ? <span className="font-bold text-teal-600">{selectedPoly.name}</span> : "tujuan"}.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" id="choice-cards-row">
            
            {/* Action Card 1: Log In (Already Registered) */}
            <div 
              onClick={onSelectLogin}
              className="p-8 bg-white border border-slate-200 hover:border-teal-500 rounded-3xl cursor-pointer hover:shadow-xl transition-all group flex flex-col gap-6 text-left relative overflow-hidden"
              id="btn-login-choice-trigger"
            >
              {/* Corner abstract decoration to match handcrafted standard */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full translate-x-12 -translate-y-12"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all">
                <Scan className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                  <span>Log in</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-150 rounded-full font-bold">
                    SUDAH TERDAFTAR
                  </span>
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">
                  Gunakan pemindaian biometric Face ID instan jika Anda sudah pernah melakukan pendaftaran data diri di unit Kiosk sebelumnya.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="group-hover:text-teal-600 transition">Instan Check-In</span>
                <span className="text-teal-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  Mulai Scan <LogIn className="w-4.5 h-4.5" />
                </span>
              </div>
            </div>

            {/* Action Card 2: Sign In (Daftar Baru) */}
            <div 
              onClick={onSelectRegister}
              className="p-8 bg-white border border-slate-200 hover:border-cyan-500 rounded-3xl cursor-pointer hover:shadow-xl transition-all group flex flex-col gap-6 text-left relative overflow-hidden"
              id="btn-sign-in-choice-trigger"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full translate-x-12 -translate-y-12"></div>

              <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white flex items-center justify-center transition-all">
                <ClipboardPen className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                  <span>Sign in</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-150 rounded-full font-bold">
                    PASIEN BARU
                  </span>
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">
                  Registrasi baru menggunakan data KTP dan simpan pemindaian Face ID baru Anda untuk kunjungan rumah sakit berikutnya yang lebih instan.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="group-hover:text-cyan-600 transition">Registrasi Data & Foto</span>
                <span className="text-cyan-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  Isi Formulir <UserPlus className="w-4.5 h-4.5" />
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center text-xs text-slate-400 border-t border-slate-100 pt-6" id="method-choice-footer">
          <p className="font-mono">Pilih salah satu metode di atas untuk melanjutkan ke tahap verifikasi medis digital.</p>
        </footer>

      </div>
    </div>
  );
}

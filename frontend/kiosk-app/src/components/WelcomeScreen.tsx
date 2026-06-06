import React from "react";
import { ArrowRight, ChevronDown, Check, Sparkles, AlertCircle, Heart } from "lucide-react";
import { Poliklinik } from "../types";
import Header from "./Header";
import { motion } from "motion/react";

interface WelcomeScreenProps {
  selectedPoly: Poliklinik | null;
  onOpenPolySelector: () => void;
  onStartRegistration: () => void;
  isPsikiatriSpecial?: boolean;
  alertMessage?: string | null;
}

export default function WelcomeScreen({
  selectedPoly,
  onOpenPolySelector,
  onStartRegistration,
  isPsikiatriSpecial = false,
  alertMessage = null,
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10" id="welcome-screen-container">
      {/* Kiosk Content Wrapper */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between">
        {/* Header Section */}
        <Header 
          selectedPoly={selectedPoly} 
          onReset={() => {}}
          rightElement={
            selectedPoly ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span className="font-display">AKTIF: {selectedPoly.name}</span>
              </div>
            ) : null
          }
        />

        {/* Inline alert when user tries to start without selecting poly */}
        {alertMessage && (
          <div id="select-poly-alert" className="max-w-6xl mx-auto mt-4 mb-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* Main Content Body */}
        <div className="grid md:grid-cols-2 gap-10 items-center my-auto py-6" id="welcome-main-layout">
          
          {/* Left Column: Greeting & Action Cards */}
          <div className="flex flex-col text-left space-y-6" id="welcome-info-pane">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/60 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-teal-800 font-display tracking-wide">
                {isPsikiatriSpecial ? "LAYANAN KHUSUS PSIKIATRI" : "SISTEM REGISTRASI MANDIRI"}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-[1.15] text-slate-900 tracking-tight">
                {isPsikiatriSpecial ? (
                  <>
                    Selamat Datang di <span className="text-teal-600">Poli Psikiatri</span> RSUD
                  </>
                ) : selectedPoly ? (
                  <>
                    Registrasi Mandiri <span className="text-teal-600">{selectedPoly.name}</span>
                  </>
                ) : (
                  <>
                    Selamat Datang di <span className="text-teal-600">Sistem Registrasi</span> RSUD
                  </>
                )}
              </h1>
              <p className="text-slate-500 font-sans text-base md:text-lg max-w-lg leading-relaxed">
                {isPsikiatriSpecial 
                  ? "Pemeriksaan kesehatan jiwa, konseling stress, depresi, dan konsultasi privat bersama dokter spesialis kami."
                  : "Silakan pilih layanan poliklinik terlebih dahulu atau langsung klik mulai registrasi untuk melanjutkan antrean Anda."}
              </p>
            </div>

            {/* Special Information Banner if Poly is selected */}
            {selectedPoly && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-teal-50/55 border border-teal-100 rounded-2xl p-4 flex gap-3 text-sm text-teal-900 shadow-xs"
                id="active-poly-banner"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-teal-950">Dokter Spesialis Bertugas:</p>
                  <p className="font-medium text-teal-700 font-mono text-xs">{selectedPoly.dokter}</p>
                </div>
              </motion.div>
            )}

            {/* Interactive Actions Pill Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4" id="welcome-action-buttons">
              <button 
                onClick={onStartRegistration}
                className="inline-flex items-center justify-between gap-3 px-8 py-4.5 bg-[#1B1B1B] text-white rounded-full font-bold text-base hover:bg-slate-800 active:scale-[0.98] cursor-pointer shadow-md tracking-wide transition-all"
                id="btn-start-registration"
              >
                <span>Mulai Registrasi</span>
                <div className="w-6 h-6 rounded-full bg-teal-500/25 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </div>
              </button>

              <button 
                onClick={onOpenPolySelector}
                className={`inline-flex items-center justify-center gap-2.5 px-7 py-4.5 rounded-full font-bold text-base cursor-pointer border transition-all ${
                  selectedPoly 
                    ? "border-teal-500 bg-teal-500/5 text-teal-800 hover:bg-teal-100/50" 
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                id="btn-select-poly"
              >
                <span>{selectedPoly ? selectedPoly.name : "Pilih Poli"}</span>
                <ChevronDown className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Column: High Quality Vector Illustration Mockup (Doctor/Patient Consulting) */}
          <div className="hidden md:flex items-center justify-center" id="welcome-graphic-pane">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Teal Blob Background Grid */}
              <div className="absolute inset-0 bg-radial from-teal-200/50 via-teal-100/10 to-transparent rounded-full blur-2xl transform scale-110 -z-10"></div>
              
              <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-xl" id="consultation-vector-illustration">
                {/* Background Shapes */}
                <path d="M 120, 250 Q 80, 100 250, 120 T 400, 300 Q 380, 420 220, 400 Z" fill="#E0F2FE" opacity="0.6"/>
                <circle cx="250" cy="250" r="160" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeDasharray="6 8" opacity="0.4"/>
                
                {/* Desk Base */}
                <rect x="100" y="360" width="300" height="20" rx="10" fill="#4B5563"/>
                <rect x="120" y="380" width="20" height="80" fill="#374151"/>
                <rect x="360" y="380" width="20" height="80" fill="#374151"/>

                {/* Desk Accessories: Monitor */}
                <rect x="220" y="310" width="60" height="40" rx="4" fill="#9CA3AF"/>
                <path d="M245,350 L255,350 L250,360 Z" fill="#4B5563"/>

                {/* Left Figure (Doctor) */}
                {/* Doctor Head */}
                <circle cx="160" cy="220" r="22" fill="#FDE047"/>
                {/* Glasses/Details */}
                <rect x="154" y="215" width="20" height="4" rx="1" fill="#1F2937"/>
                {/* Stethoscope */}
                <path d="M 160,242 A 15,15 0 0,0 190,260" fill="none" stroke="#6B7280" strokeWidth="3"/>
                {/* Doctor Body */}
                <path d="M 120, 360 L 200, 360 C 200, 310 190, 270 160, 270 C 130, 270 120, 310 120, 360 Z" fill="#2563EB" />
                {/* Lab Coat Overlap */}
                <path d="M 140, 270 L 160, 310 L 180, 270" fill="none" stroke="#FFFFFF" strokeWidth="4"/>
                <rect x="156" y="270" width="8" height="90" fill="#FFFFFF"/>

                {/* Right Figure (Patient) */}
                {/* Patient Head */}
                <circle cx="340" cy="230" r="22" fill="#F59E0B"/>
                {/* Patient Hair */}
                <path d="M 318, 230 C 318, 204 362, 204 362, 230" fill="none" stroke="#1F2937" strokeWidth="6"/>
                {/* Patient Body */}
                <path d="M 300, 360 L 380, 360 C 380, 320 370, 280 340, 280 C 310, 280 300, 320 300, 360 Z" fill="#0D9488" />

                {/* Flying Hearts / Medical Plus Accents */}
                <g fill="#EF4444" transform="translate(230, 150) scale(0.04)">
                  <path d="M12 4.419C1.2-1.316-6.264 6.111 12 22 30.264 6.111 22.8-1.316 12 4.419z" />
                </g>
                <g transform="translate(140, 140)">
                  <rect x="6" y="0" width="4" height="16" rx="2" fill="#2DD4BF" />
                  <rect x="0" y="6" width="16" height="4" rx="2" fill="#2DD4BF" />
                </g>
                <g transform="translate(320, 160)">
                  <rect x="4" y="0" width="3" height="11" rx="1" fill="#3B82F6" />
                  <rect x="0" y="4" width="11" height="3" rx="1" fill="#3B82F6" />
                </g>
              </svg>
            </div>
          </div>

        </div>

        {/* Footer Section */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 text-slate-400 text-xs text-center sm:text-left gap-4" id="welcome-footer">
          <p className="font-mono">Versi Sistem: 2.4.0 • RSUD SIMRSUD Digital Kiosk System</p>
          <p className="font-display font-medium">© {new Date().getFullYear()} RSUD SIMRSUD. Hak Cipta Dilindungi.</p>
        </footer>
      </div>
    </div>
  );
}
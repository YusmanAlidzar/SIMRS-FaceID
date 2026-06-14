import React, { useEffect, useState } from "react";
import { CheckCircle2, Check, Sparkles, Printer, Eye, ChevronRight } from "lucide-react";
import { Poliklinik, PatientInfo } from "../types";
import Header from "./Header";
import { motion } from "motion/react";

interface SuccessScreenProps {
  selectedPoly: Poliklinik | null;
  patientData: PatientInfo;
  onFinish: () => void;
}

export default function SuccessScreen({
  selectedPoly,
  patientData,
  onFinish,
}: SuccessScreenProps) {
  const [printing, setPrinting] = useState(true);

  // Auto delay of 3 seconds for physical printer simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrinting(false);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const currentHour = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  }) + " WIB";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10" id="success-screen">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between">
        
        {/* Header toolbar */}
        <Header 
          selectedPoly={selectedPoly} 
          onReset={onFinish}
          rightElement={
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>TRANSAKSI OK</span>
            </div>
          }
        />

        {/* Success Core Block layout */}
        <div className="my-auto py-4 space-y-10 text-center max-w-xl mx-auto" id="success-body">
          
          {/* Floating animated checkcircle */}
          <div className="flex flex-col items-center space-y-4" id="success-indicators">
            <div className="relative w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xs border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full scale-105 animate-ping opacity-15"></div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="p-0.5 px-2 bg-emerald-50 text-emerald-800 text-[9px] font-extrabold rounded-full font-mono tracking-wider">REGISTRASI BERHASIL!</span>
                <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-bounce" />
              </div>
              <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight leading-tight">
                Ambil Karcis Antrean Anda
              </h2>
              <p className="text-slate-500 font-sans text-xs max-w-md mx-auto leading-relaxed">
                Silakan ambil struk antrean fisik yang dicetak oleh printer Kiosk di bawah ini. Harap membawanya ke loket pendaftaran klinis beserta kartu identitas.
              </p>
            </div>
          </div>

          {/* Interactive Graphic: Virtual Printer Machine simulating ticket print */}
          <div className="relative bg-slate-900 border-4 border-slate-950 p-4 rounded-3xl h-62 overflow-hidden flex flex-col justify-between shadow-2xl" id="printer-device-mock">
            {/* Slot indicator */}
            <div className="w-4/5 mx-auto h-2 bg-slate-950 rounded-full relative z-10">
              <div className="absolute inset-0 bg-emerald-400/35 animate-pulse rounded-full"></div>
            </div>

            {/* Simulated Paper Struk Sliding Out with animation */}
            <div className={`w-[220px] mx-auto bg-white border border-slate-200 shadow-md p-3.5 font-mono text-[9px] text-slate-800 text-left space-y-2 z-0 relative ${
              printing ? "animate-print mt-0" : "mt-2"
            }`} id="printed-struk">
              
              <div className="text-center border-b border-dashed border-slate-200 pb-1.5 font-bold">
                <p className="text-[7.5px] uppercase tracking-wider text-slate-900">STRUK ANTRIAN MANDIRI</p>
                <p className="text-[6.5px] text-slate-400">RSUD SIMRSUD DIGITAL</p>
              </div>

              <div className="text-center my-1.5">
                <p className="text-[6px] text-slate-400 leading-none">NO. ANTRIAN</p>
                <p className="text-2xl font-black font-display text-slate-950 tracking-tight leading-none my-1">{patientData.queueNumber || `${selectedPoly?.code || 'UMM'}001`}</p>
              </div>

              <div className="space-y-1 text-[8px] leading-tight border-t border-dashed border-slate-200 pt-1.5 text-slate-600">
                <p><span className="text-slate-400">Nama:</span> <span className="font-bold text-slate-900">{patientData.nama || "Budi Santoso"}</span></p>
                <p><span className="text-slate-400">Poli:</span> <span className="font-bold text-emerald-800 uppercase">{selectedPoly ? selectedPoly.name : "Poli Umum"}</span></p>
                <p><span className="text-slate-400">Waktu:</span> <span>{patientData.visitDate || currentDate} • {patientData.visitTime || currentHour}</span></p>
              </div>

              <div className="h-4 bg-slate-100 flex items-stretch gap-0.5 pointer-events-none mt-2">
                {Array.from({ length: 28 }).map((_, idx) => (
                  <div key={idx} className="flex-1 bg-slate-800" style={{ height: `${(idx % 3 === 0 ? 90 : 50)}%` }} />
                ))}
              </div>
            </div>

            {/* Printer dynamic indicator bottom bar */}
            <div className="z-10 py-1 border-t border-slate-800 bg-slate-950 text-[10px] font-mono font-bold text-slate-500 tracking-wider flex items-center justify-center gap-1.5 select-none uppercase">
              <Printer className={`w-3.5 h-3.5 ${printing ? "text-emerald-400 animate-spin" : "text-slate-500"}`} />
              <span className={printing ? "text-emerald-400" : ""}>
                {printing ? "Mencetak Struk Antrean..." : "Selesai • Silakan Ambil Struk"}
              </span>
            </div>

          </div>

          {/* Selesai control button */}
          <div className="flex justify-center" id="success-primary-action">
            <button 
              onClick={onFinish}
              className="px-10 py-4.5 bg-[#1B1B1B] hover:bg-slate-800 text-white font-extrabold text-sm uppercase tracking-widest rounded-full cursor-pointer transition shadow-md inline-flex items-center gap-2 active:scale-[0.98]"
              id="btn-success-selesai"
            >
              <span>Selesai</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>

        {/* Footer legal notes */}
        <footer className="w-full text-center text-xs text-slate-400 border-t border-slate-100 pt-6" id="success-footer">
          <p className="font-mono">Terima kasih atas kerja samanya • RSUD SIMRSUD Melayani Dengan Hati.</p>
        </footer>

      </div>
    </div>
  );
}

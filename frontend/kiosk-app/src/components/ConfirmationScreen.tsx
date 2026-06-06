import React from "react";
import { ArrowLeft, Check, Ticket, FileArchive, Calendar, User, Clock } from "lucide-react";
import { Poliklinik, PatientInfo } from "../types";
import Header from "./Header";

interface ConfirmationScreenProps {
  selectedPoly: Poliklinik | null;
  patientData: PatientInfo;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmationScreen({
  selectedPoly,
  patientData,
  onCancel,
  onConfirm,
}: ConfirmationScreenProps) {
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10" id="confirmation-screen">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between">
        
        {/* Header bar layout */}
        <Header 
          selectedPoly={selectedPoly} 
          onReset={onCancel}
          rightElement={
            <button 
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full text-xs font-semibold hover:bg-slate-50 transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="font-display">Kembali</span>
            </button>
          }
        />

        {/* Dynamic Verification Content Block */}
        <div className="my-auto py-6 space-y-6" id="confirm-body">
          <div className="text-center space-y-1.5 max-w-xl mx-auto border-b border-slate-100 pb-4">
            <span className="text-[10px] bg-emerald-50 border border-emerald-150 rounded-full text-emerald-700 p-1 px-2.5 font-bold tracking-wider font-mono">VERIFIKASI UTK CETAK</span>
            <h2 className="text-2xl font-black font-display text-slate-900">Verifikasi Detail Cetak Antrean</h2>
            <p className="text-slate-400 text-xs">
              Silakan periksa ulang semua kolom administratif di bawah ini sebelum mengonfirmasi cetak fisik karcis antrean loket.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center" id="confirm-grid-row">
            
            {/* Left Column: Physical Ticket Mockup (Paper Receipt Aesthetic) (5 Columns) */}
            <div className="md:col-span-5 flex justify-center" id="ticket-mockup-wrapper">
              <div 
                className="w-full max-w-[290px] bg-white border border-slate-200 shadow-lg rounded-t-xl rounded-b-none relative flex flex-col font-mono text-xs text-slate-700 p-5 space-y-4"
                id="receipt-physical-paper"
              >
                {/* Receipt Zigzag line mockup at top */}
                <div className="absolute top-0 inset-x-0 h-1 flex justify-between bg-[#F8FAFC] pointer-events-none overflow-hidden scale-x-[1.05]">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-slate-200 rotate-45 -translate-y-2 shrink-0"></div>
                  ))}
                </div>

                {/* Ticket Header */}
                <div className="text-center pt-2 border-b border-dashed border-slate-200 pb-3" id="receipt-heading-block">
                  <span className="text-[10px] font-black text-slate-900 block tracking-wide">STRUK ANTRIAN POLIKLINIK</span>
                  <span className="text-[9px] font-bold text-slate-400 block tracking-wider mt-0.5">RSUD SIMRSUD DIGITAL</span>
                </div>

                {/* Big queue indicator code */}
                <div className="text-center py-1.5" id="receipt-queue-indicator">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest leading-none">NOMOR ANTRIAN</span>
                  <span className="text-5xl font-black font-display text-slate-950 block tracking-tight leading-none my-1">A001</span>
                </div>

                {/* Detail records */}
                <div className="space-y-2.5 pt-2 border-t border-dashed border-slate-200" id="receipt-fields-list">
                  <div className="flex flex-col gap-0.5" id="receipt-field-nama">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wider">NAMA PASIEN:</span>
                    <span className="text-xs font-bold text-slate-950 uppercase">{patientData.nama || "Budi Santoso"}</span>
                  </div>

                  <div className="flex flex-col gap-0.5" id="receipt-field-poly">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wider">POLI TUJUAN:</span>
                    <span className="text-xs font-black text-emerald-800 uppercase">{selectedPoly ? selectedPoly.name : "Poli Umum"}</span>
                  </div>

                  <div className="flex flex-col gap-0.5" id="receipt-field-dokter">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wider">DOKTER AJUAN:</span>
                    <span className="text-[10px] font-bold text-slate-800 uppercase line-clamp-1">{selectedPoly ? selectedPoly.dokter : "dr. Andi Wijaya, Sp.A"}</span>
                  </div>

                  <div className="flex flex-col gap-0.5" id="receipt-field-waktu">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wider">JADWAL KUNJUNGAN:</span>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase">
                      {currentDate} • {currentHour}
                    </span>
                  </div>
                </div>

                {/* Receipt barcode decorative element */}
                <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col items-center gap-1 text-center" id="receipt-barcode-footer">
                  <div className="w-full h-8 flex items-stretch gap-0.5 px-3">
                    {Array.from({ length: 44 }).map((_, idx) => {
                      const heights = [100, 60, 45, 80, 50, 95, 70, 30];
                      const height = heights[idx % heights.length];
                      return (
                        <div 
                          key={idx} 
                          className="flex-1 bg-slate-900" 
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[7px] text-slate-400 tracking-widest font-sans">KIOSKSECURETOKEN-*A001*</span>
                </div>

                {/* Bottom Receipt tear effect */}
                <div className="absolute -bottom-2 inset-x-0 h-2 flex justify-between bg-[#F8FAFC] pointer-events-none overflow-hidden scale-x-[1.05]">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-white rotate-45 translate-y-1 shrink-0 border-t border-l border-slate-100"></div>
                  ))}
                </div>

              </div>
            </div>

            {/* Right Column: Profile Auditing Table (7 Columns) */}
            <div className="md:col-span-7 space-y-6" id="audits-table-container">
              
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden" id="verifikasi-data-table-card">
                <div className="p-4.5 bg-slate-50 border-b border-slate-100 font-bold text-sm font-display text-slate-800">
                  Verifikasi Data Pasien
                </div>
                
                <div className="divide-y divide-slate-100 text-xs" id="confirm-v-lines">
                  
                  {/* Row 1: NIK */}
                  <div className="grid grid-cols-3 p-4 items-center">
                    <span className="text-slate-400 font-bold uppercase font-display">NIK Pasien</span>
                    <span className="col-span-2 text-slate-800 font-mono tracking-wide font-bold text-sm">
                      {patientData.nik || "32730********621"}
                    </span>
                  </div>

                  {/* Row 2: Nama */}
                  <div className="grid grid-cols-3 p-4 items-center">
                    <span className="text-slate-400 font-bold uppercase font-display">Nama Pasien</span>
                    <span className="col-span-2 text-slate-800 font-semibold font-sans text-sm">
                      {patientData.nama || "Budi Santoso"}
                    </span>
                  </div>

                  {/* Row 3: TTL */}
                  <div className="grid grid-cols-3 p-4 items-center">
                    <span className="text-slate-400 font-bold uppercase font-display">Tanggal Lahir</span>
                    <span className="col-span-2 text-slate-800 font-mono font-semibold">
                      {patientData.tanggalLahir || "12 Juni 1993"}
                    </span>
                  </div>

                  {/* Row 4: Poli */}
                  <div className="grid grid-cols-3 p-4 items-center">
                    <span className="text-slate-400 font-bold uppercase font-display">Poli Tujuan</span>
                    <span className="col-span-2 text-emerald-850 font-bold font-display text-sm">
                      {selectedPoly ? selectedPoly.name : "Poli Umum"}
                    </span>
                  </div>

                  {/* Row 5: Dokter */}
                  <div className="grid grid-cols-3 p-4 items-center">
                    <span className="text-slate-400 font-bold uppercase font-display">Dokter Spesialis</span>
                    <span className="col-span-2 text-slate-700 font-medium font-mono">
                      {selectedPoly ? selectedPoly.dokter : "dr. Andi Wijaya, Sp.A"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Warning Notice card */}
              <div className="flex bg-amber-50 border border-amber-200 rounded-xl p-4 gap-3 text-amber-900" id="ticket-warn-box">
                <Ticket className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-amber-800 font-medium font-sans">
                  Dengan menekan tombol konfirmasi, printer thermal didalam unit Kiosk akan mencetak struk antrean ini. Harap tunggu struk keluar sepenuhnya sebelum diambil.
                </p>
              </div>

            </div>

          </div>

          {/* Action Row of Capsule buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-3" id="confirm-bottom-actions">
            <button 
              onClick={onCancel}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer text-center transition"
            >
              batal
            </button>

            <button 
              onClick={onConfirm}
              className="px-10 py-3.5 bg-[#1B1B1B] hover:bg-slate-800 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl cursor-pointer transition shadow-md active:scale-[0.98]"
            >
              ya, konfirmasi
            </button>
          </div>

        </div>

        {/* Footer legal disclaimer links */}
        <footer className="w-full text-center text-xs text-slate-400 border-t border-slate-100 pt-6" id="confirm-footer">
          <p className="font-mono">Kiosk Inkjet & Thermal Subsystem • RSUD SIMRSUD Digital Kiosk Hardware Integration</p>
        </footer>

      </div>
    </div>
  );
}

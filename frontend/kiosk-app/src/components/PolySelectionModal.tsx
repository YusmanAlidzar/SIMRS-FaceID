import React, { useState } from "react";
import * as Icons from "lucide-react";
import { Poliklinik, POLIKLINIK_LIST } from "../types";
import { X, Search, HeartPulse, Sparkles } from "lucide-react";

interface PolySelectionModalProps {
  onSelectPoly: (poly: Poliklinik) => void;
  onClose: () => void;
}

export default function PolySelectionModal({ onSelectPoly, onClose }: PolySelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter based on input search term
  const filteredPolys = POLIKLINIK_LIST.filter((poly) =>
    poly.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poly.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="poly-selection-overlay">
      
      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="poly-selection-modal"
      >
        
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between" id="poly-selection-header">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-full font-display">MENU REKANAN</span>
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black font-display text-slate-800">Pilih Layanan Poliklinik</h2>
            <p className="text-slate-400 text-xs font-sans">
              Pilih poliklinik tujuan pelayanan medis Anda hari ini untuk disematkan pada pencetakan tiket registrasi.
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200/50"
            aria-label="Tutup"
            id="btn-close-poly-modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="px-6 md:px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3" id="poly-selection-search-container">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari poliklinik medis... (contoh: Poli Anak, Poli Gigi)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm text-slate-700 shadow-xs"
              id="poly-input-search"
            />
          </div>
          
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Modal List Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/20" id="poly-selection-body">
          {filteredPolys.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="poly-grid-layout">
              {filteredPolys.map((poly) => {
                // Resolve icon dynamically from lucide-react dictionary
                const IconComponent = (Icons as any)[poly.icon] || HeartPulse;
                
                return (
                  <div 
                    key={poly.id}
                    onClick={() => onSelectPoly(poly)}
                    className="p-5 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-teal-500 hover:bg-teal-50/10 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
                    id={`poly-card-${poly.id}`}
                  >
                    <div className="space-y-3">
                      {/* Logo and code details */}
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-teal-50/80 text-teal-600 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-sm">
                          {poly.code}
                        </span>
                      </div>
                      
                      {/* Name & description of poly */}
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800 text-base font-display group-hover:text-teal-980 transition-colors">
                          {poly.name}
                        </h4>
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                          {poly.description}
                        </p>
                      </div>
                    </div>

                    {/* Duty doctor label */}
                    <div className="pt-3 border-t border-slate-100 mt-2 text-[10px] font-medium text-slate-500 group-hover:text-teal-950 flex flex-col gap-0.5">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider font-mono">Dokter Spesialis:</span>
                      <span className="font-semibold text-slate-700 truncate leading-tight group-hover:text-teal-900 font-mono">
                        {poly.dokter}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center" id="poly-empty-state">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-700">Poliklinik Tidak Ditemukan</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Kata kunci pencarian Anda tidak terdaftar dalam sistem poliklinik RSUD SIMRSUD.
              </p>
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 md:px-8 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-400" id="poly-selection-footer">
          <span>Terdaftar {POLIKLINIK_LIST.length} Layanan Aktif</span>
          <span>RSUD SIMRSUD Digital Kiosk</span>
        </div>

      </div>
    </div>
  );
}

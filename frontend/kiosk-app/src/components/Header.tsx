import React from "react";
import { HeartPulse, Building2, ShieldCheck } from "lucide-react";
import { Poliklinik } from "../types";

interface HeaderProps {
  selectedPoly: Poliklinik | null;
  onReset?: () => void;
  rightElement?: React.ReactNode;
}

export default function Header({ selectedPoly, onReset, rightElement }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between pb-6 border-b border-slate-100 mb-8" id="kiosk-app-header">
      {/* Left Capsule: RSUD Logo */}
      <div 
        onClick={onReset}
        className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-xs cursor-pointer hover:bg-slate-50 transition-all"
        id="header-logo-capsule"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white">
          <HeartPulse className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold font-display tracking-wide text-slate-800 uppercase leading-none">RSUD SIMRSUD</span>
          <span className="text-[9px] text-slate-400 font-mono tracking-tight font-medium leading-none mt-0.5">SISTEM INTEGRASI</span>
        </div>
      </div>

      {/* Middle Status Badge */}
      <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-5 py-1.5 rounded-full" id="header-welcome-badge">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        <span className="text-xs font-semibold text-amber-800 tracking-wider font-display uppercase">
          {selectedPoly ? `POLIKLINIK: ${selectedPoly.name.toUpperCase()}` : "SELAMAT DATANG"}
        </span>
      </div>

      {/* Right Side Controls or Logo Block */}
      <div className="flex items-center gap-3" id="header-right-block">
        {rightElement ? (
          rightElement
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-mono text-[10px]">KIOSK-03 • SECURE</span>
          </div>
        )}
      </div>
    </header>
  );
}

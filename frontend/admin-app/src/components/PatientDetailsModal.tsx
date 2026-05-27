import React from 'react';
import { Patient, Visit } from '../types';

interface PatientDetailsModalProps {
  patient: Patient | null;
  visit?: Visit | null;
  onClose: () => void;
  onUpdateStatus?: (patientId: string, newStatus: Patient['status']) => void;
  onUpdateVisitStatus?: (visitId: string, newStatus: Visit['status']) => void;
}

export default function PatientDetailsModal({
  patient,
  visit,
  onClose,
  onUpdateStatus,
  onUpdateVisitStatus
}: PatientDetailsModalProps) {
  if (!patient) return null;

  // Derive initial letters
  const initials = patient.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateStatus) {
      onUpdateStatus(patient.id, e.target.value as Patient['status']);
    }
  };

  const handleVisitStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (visit && onUpdateVisitStatus) {
      onUpdateVisitStatus(visit.id, e.target.value as Visit['status']);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-outline-variant animate-card-scale">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-white flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border border-white/30">
              {initials}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                Dossier Medis
              </span>
              <h4 className="text-lg font-bold mt-1">{patient.name}</h4>
              <p className="text-xs text-white/80">{patient.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main profile grids */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
              <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Jenis Kelamin</p>
              <p className="text-sm font-semibold text-on-surface mt-0.5">{patient.gender}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
              <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Umur / Usia</p>
              <p className="text-sm font-semibold text-on-surface mt-0.5">{patient.age}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 col-span-2">
              <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Nomor Telepon</p>
              <p className="text-sm font-semibold text-on-surface mt-0.5">{patient.phone || 'Tidak tersedia'}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 col-span-2">
              <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Alamat Tinggal</p>
              <p className="text-sm font-medium text-on-surface mt-0.5 leading-relaxed">{patient.address}</p>
            </div>
          </div>

          <hr className="border-outline-variant/40" />

          {/* Visit metadata if available */}
          {visit && (
            <div className="space-y-3 bg-[#e3fffe]/30 p-4 rounded-xl border border-primary-container/20">
              <h5 className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">assignment</span>Informasi Kunjungan Hari Ini
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-outline">Poliklinik / Unit</p>
                  <p className="font-semibold text-on-surface mt-0.5">{visit.poliklinik}</p>
                </div>
                <div>
                  <p className="text-outline">Dokter Penanggung Jawab</p>
                  <p className="font-semibold text-on-surface mt-0.5">{visit.doctor}</p>
                </div>
                <div>
                  <p className="text-outline">Waktu Masuk</p>
                  <p className="font-semibold text-on-surface mt-0.5">{visit.time}</p>
                </div>
                <div>
                  <p className="text-outline">Status Tindakan</p>
                  <p className="font-semibold text-on-surface mt-0.5">{visit.status}</p>
                </div>
              </div>

              {onUpdateVisitStatus && (
                <div className="mt-3">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                    Ubah Status Layanan Kunjungan
                  </label>
                  <select
                    value={visit.status}
                    onChange={handleVisitStatusChange}
                    className="w-full text-xs font-medium border border-outline-variant rounded-lg p-2 bg-white"
                  >
                    <option value="Antri">Antri / Mengantri</option>
                    <option value="Menunggu">Menunggu Dokter</option>
                    <option value="Pemeriksaan">Pemeriksaan / Sedang Diperiksa</option>
                    <option value="Diperiksa">Diperiksa</option>
                    <option value="Gawat">Gawat / Urgen</option>
                    <option value="Selesai">Selesai Layanan</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Status Settings */}
          {onUpdateStatus && (
            <div>
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                Status Registrasi Pasien (General)
              </label>
              <select
                value={patient.status}
                onChange={handleStatusChange}
                className="w-full text-xs font-medium border border-outline-variant rounded-lg p-2 bg-white"
              >
                <option value="Inpatient">Inpatient (Rawat Inap)</option>
                <option value="Outpatient">Outpatient (Rawat Jalan)</option>
                <option value="Critical">Critical (Sakit Kritis / UGD)</option>
                <option value="Discharged">Discharged (Selesai Rawat/Keluar)</option>
              </select>
            </div>
          )}

          {/* Health vital simulator block */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-2">
            <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Hasil Pengamatan Vitals Pasien
            </h5>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-lg border border-outline-variant/30">
                <p className="text-[10px] text-outline">Tensi Darah</p>
                <p className="font-bold text-primary mt-0.5">120/80 mmHg</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-outline-variant/30">
                <p className="text-[10px] text-outline">Detak Jantung</p>
                <p className="font-bold text-secondary mt-0.5">72 bpm</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-outline-variant/30">
                <p className="text-[10px] text-outline">Suhu Tubuh</p>
                <p className="font-bold text-tertiary mt-0.5">36.5 °C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-surface-container border-t border-outline-variant flex justify-between gap-2">
          <p className="text-[10px] text-outline/80 self-center">
            Terdaftar sejak: {patient.registeredDate || '2023-10-24'}
          </p>
          <button
            onClick={onClose}
            className="bg-primary text-white text-xs px-5 py-2.5 rounded-xl font-bold hover:bg-opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            Tutup Catatan
          </button>
        </div>
      </div>
    </div>
  );
}

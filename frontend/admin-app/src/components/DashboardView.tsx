import React, { useState } from 'react';
import { Patient, Visit, NotificationItem } from '../types';

interface DashboardViewProps {
  patients: Patient[];
  visits: Visit[];
  notifications: NotificationItem[];
  onOpenAddPatient: () => void;
  onClearNotification: (id: string) => void;
  onViewPatientDetails: (patient: Patient, visit?: Visit) => void;
  onTabChange: (tab: 'dashboard' | 'visits' | 'patients') => void;
}

export default function DashboardView({
  patients,
  visits,
  notifications,
  onOpenAddPatient,
  onClearNotification,
  onViewPatientDetails,
  onTabChange
}: DashboardViewProps) {
  const [selectedPoliFilter, setSelectedPoliFilter] = useState('Semua Poli');

  // Filter latest visits based on selected poliklinik dropdown
  const filteredVisitsForLatest = visits.filter((visit) => {
    if (selectedPoliFilter === 'Semua Poli') return true;
    return visit.poliklinik.toLowerCase().includes(selectedPoliFilter.toLowerCase()) || 
           visit.poliklinik.replace('Poli ', '').toLowerCase() === selectedPoliFilter.toLowerCase();
  });

  // Unique list of poliklinik for display
  const poliList = ['Semua Poli', 'Poli Penyakit Dalam', 'Poli Anak', 'Poli Kandungan', 'UGD', 'Poli Umum', 'Poli Gigi'];

  // Safe Print Action Function helper
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Navigation bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-primary tracking-tight">Ringkasan Dashboard</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Selamat datang kembali, pantau operasional rumah sakit secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddPatient}
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Registrasi Pasien
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Pasien */}
        <div className="glass-card p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Pasien</p>
            <h4 className="text-3xl font-black text-on-surface mt-1">
              {(12835 + patients.length).toLocaleString('id-ID')}
            </h4>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary font-bold mt-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>4.2% dari bulan lalu</span>
          </div>
        </div>

        {/* Kunjungan Hari Ini */}
        <div className="glass-card p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-[24px]">calendar_today</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kunjungan Hari Ini</p>
            <h4 className="text-3xl font-black text-on-surface mt-1">
              {visits.length + 338}
            </h4>
          </div>
          <div className="flex items-center gap-1 text-xs text-secondary font-bold mt-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>85% Selesai dilayani</span>
          </div>
        </div>

        {/* Kapasitas Bed */}
        <div className="glass-card p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-[24px]">bed</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kapasitas Bed</p>
            <h4 className="text-3xl font-black text-on-surface mt-1">82%</h4>
          </div>
          <div className="w-full bg-outline-variant/30 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full w-[82%]"></div>
          </div>
        </div>

        {/* Pendapatan Harian */}
        <div className="glass-card p-5 rounded-2xl flex flex-col gap-3 border-l-4 border-primary relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pendapatan (IDR)</p>
            <h4 className="text-3xl font-black text-on-surface mt-1">42.5M</h4>
          </div>
          <div className="flex items-center gap-1 text-xs text-outline mt-1">
            <span className="material-symbols-outlined text-[16px]">update</span>
            <span>Terakhir diupdate 10 menit lalu</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout (Asymmetric) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Recent Patients */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h5 className="text-lg font-bold text-on-surface">Daftar Pasien Terbaru</h5>
              
              {/* Dropdown Filter */}
              <div className="relative inline-block text-left">
                <select
                  value={selectedPoliFilter}
                  onChange={(e) => setSelectedPoliFilter(e.target.value)}
                  className="appearance-none bg-surface-container-highest/50 border border-outline-variant text-[13px] rounded-xl py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-semibold outline-none"
                >
                  {poliList.map((poli) => (
                    <option key={poli} value={poli}>
                      {poli}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
            
            <button
              onClick={() => onTabChange('visits')}
              className="text-primary text-xs font-bold hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          {/* Table Container */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">No. RM</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Nama Pasien</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Poli / Unit</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredVisitsForLatest.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-outline">
                        Tidak ada catatan kunjungan hari ini untuk poliklinik tersebut
                      </td>
                    </tr>
                  ) : (
                    filteredVisitsForLatest.slice(0, 5).map((visit) => {
                      // Link visit to a patient if possible
                      const patientRecord = patients.find(p => p.id === visit.patientId) || {
                        id: visit.patientId,
                        name: visit.patientName,
                        gender: visit.gender,
                        age: visit.age,
                        address: 'Data Alamat Tersembunyi',
                        status: 'Outpatient' as const,
                        registeredDate: '2023-10-24'
                      };

                      // Map string status to appropriate badges from html template
                      let badgeStyle = 'bg-secondary-fixed text-on-secondary-fixed';
                      if (visit.status === 'Gawat') {
                        badgeStyle = 'bg-error-container text-on-error-container';
                      } else if (visit.status === 'Diperiksa' || visit.status === 'Pemeriksaan') {
                        badgeStyle = 'bg-primary-fixed text-on-primary-fixed-variant';
                      } else if (visit.status === 'Selesai') {
                        badgeStyle = 'bg-secondary-container text-on-secondary-container';
                      } else if (visit.status === 'Menunggu') {
                        badgeStyle = 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
                      }

                      return (
                        <tr
                          key={visit.id}
                          onClick={() => onViewPatientDetails(patientRecord, visit)}
                          className="hover:bg-secondary-container/20 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-4 text-xs font-mono font-bold text-primary group-hover:underline">
                            {visit.id}
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm font-semibold text-on-surface">{visit.patientName}</div>
                            <div className="text-[11px] text-outline mt-0.5">{visit.gender}, {visit.age}</div>
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-on-surface-variant">
                            {visit.poliklinik}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${badgeStyle}`}>
                              {visit.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-outline">
                            {visit.time}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right column: Action Guides & Widgets */}
        <aside className="flex flex-col gap-6">
          
          {/* Healthcare Hero Card / Clinic Image with overlaid details */}
          <div className="relative h-48 rounded-2xl overflow-hidden shadow-md group border border-outline-variant/40">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi_Pscqmw22oDPlzR1FooIlN-XpXusZfdTxMEa1tuOgmuWb8MZOhmrltptdlxTEG0bqP9q_zT65u64JbjXVKp0vgfj-zjMg0dKnn0BKoOaWRCBI2eku_RAfTA3zDXYlY5ojjp9xFladWoGDAxiQX7bgcZC3jtmR4MYZV_T2WOWU9e2Jgf3VQN71y3JHSOVjv2rSzHgeqtwiNVJxLO15bKcGxf3k04GuBV2dNXqmCl6xE0mEzHGgx1-TIb0-fsDOJ4IicXStHA6_cQ"
              alt="Hospital Ward"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#93f2f2] mb-1">PENGUMUMAN</span>
              <p className="text-white font-bold text-lg leading-tight">Informasi Lab Penting</p>
              <p className="text-white/85 text-xs mt-1 leading-relaxed">Hasil tes laboratorium tersedia lebih cepat hari ini melalui server utama.</p>
            </div>
          </div>

          {/* Real Dismissable Notifications Alert Container */}
          <div className="glass-card p-5 rounded-2xl shadow-sm">
            <h5 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Pemberitahuan Sistem</span>
              {notifications.length > 0 && (
                <span className="text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-bold">
                  {notifications.length} Aktif
                </span>
              )}
            </h5>
            
            <div className="flex flex-col gap-3">
              {notifications.length === 0 ? (
                <div className="p-4 text-center rounded-xl bg-surface-container/40 text-xs text-outline border border-dashed border-outline-variant/60">
                  Semua sistem normal. Tidak ada pemberitahuan baru.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-start p-2.5 rounded-xl hover:bg-surface-container transition-all group relative border border-outline-variant/20 bg-white/50"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'urgent' ? 'bg-error animate-pulse' : 'bg-primary'}`}></div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-on-surface leading-tight">{item.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-normal">{item.description}</p>
                    </div>
                    
                    {/* Clear button */}
                    <button
                      onClick={() => onClearNotification(item.id)}
                      className="text-outline/40 hover:text-error transition-colors p-1"
                      title="Selesai / Sembunyikan"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Daily Clinic Advisory and Tips Card */}
          <div className="bg-secondary-container p-5 rounded-2xl border border-[#c8e7d8] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-on-secondary-container">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <h6 className="text-[11px] font-bold uppercase tracking-wider">Tips Efisiensi Medis</h6>
            </div>
            <p className="text-xs text-on-secondary-container font-medium leading-relaxed">
              Gunakan modul <strong className="text-primary font-bold">"Data Pasien"</strong> &amp; <strong className="text-primary font-bold">"Add Patient"</strong> untuk meregistrasi rujukan lama guna memangkas antrian pagi loket pendaftaran.
            </p>
          </div>
        </aside>
      </div>

      {/* High-quality print/report Float Action Button (FAB) and click helper */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handlePrintReport}
          title="Cetak Laporan SIMRSUD Harian"
          className="bg-primary-container text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 hover:bg-primary transition-all duration-200 cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-6 transition-transform">
            print
          </span>
        </button>
      </div>
    </div>
  );
}

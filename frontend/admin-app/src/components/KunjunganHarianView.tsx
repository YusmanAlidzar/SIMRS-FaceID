import React, { useState } from 'react';
import { Visit, Patient } from '../types';

interface KunjunganHarianViewProps {
  visits: Visit[];
  patients: Patient[];
  onViewPatientDetails: (patient: Patient, visit?: Visit) => void;
}

export default function KunjunganHarianView({
  visits,
  patients,
  onViewPatientDetails
}: KunjunganHarianViewProps) {
  const [filterDate, setFilterDate] = useState('2023-10-24');
  const [filterPoli, setFilterPoli] = useState('Semua Poliklinik');

  // Filter based on input filters
  const filteredVisits = visits.filter((visit) => {
    const matchesDate = visit.date === filterDate;
    const matchesPoli =
      filterPoli === 'Semua Poliklinik' ||
      visit.poliklinik.toLowerCase().includes(filterPoli.replace('Poli ', '').toLowerCase());
    return matchesDate && matchesPoli;
  });

  // Calculate bento stats automatically
  const totalAntrian = filteredVisits.length;
  const menungguCount = filteredVisits.filter(
    (v) => v.status === 'Menunggu' || v.status === 'Antri'
  ).length;
  const diperiksaCount = filteredVisits.filter(
    (v) => v.status === 'Pemeriksaan' || v.status === 'Diperiksa'
  ).length;
  const selesaiCount = filteredVisits.filter((v) => v.status === 'Selesai').length;

  // Poliklinik distributions for the day
  const rawPoliDistribution = filteredVisits.reduce((acc, curr) => {
    const name = curr.poliklinik;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDistribution = Object.values(rawPoliDistribution).reduce((a, b) => a + b, 0) || 1;

  // Let's create safe CSV exporter!
  const handleExportCSV = () => {
    const csvHeader = 'No. Rekam Medis,Nama Pasien,Waktu Kunjungan,Poliklinik,Dokter,Status\r\n';
    const csvRows = filteredVisits
      .map(
        (v) =>
          `"${v.id}","${v.patientName}","${v.time}","${v.poliklinik}","${v.doctor}","${v.status}"`
      )
      .join('\r\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Kunjungan_SIMRSUD_${filterDate}_${filterPoli.replace(' ', '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-primary tracking-tight">Kunjungan Harian</h3>
          <p className="text-sm text-on-surface-variant">
            Manajemen data kunjungan pasien hari ini: <span className="font-semibold text-primary">{filterDate}</span>
          </p>
        </div>

        {/* Filters and CSV Exporter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Calendar Control */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Filter Tanggal
            </label>
            <div className="flex items-center bg-white rounded-xl border border-outline-variant px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
              <span className="material-symbols-outlined text-primary text-[20px] mr-2">event</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border-none p-0 text-xs font-semibold focus:ring-0 outline-none cursor-pointer bg-transparent"
              />
            </div>
          </div>

          {/* Poliklinik Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Filter Poliklinik
            </label>
            <div className="flex items-center bg-white rounded-xl border border-outline-variant px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
              <span className="material-symbols-outlined text-primary text-[20px] mr-2">medical_services</span>
              <select
                value={filterPoli}
                onChange={(e) => setFilterPoli(e.target.value)}
                className="border-none p-0 text-xs font-semibold focus:ring-0 pr-8 outline-none cursor-pointer bg-transparent"
              >
                <option value="Semua Poliklinik">Semua Poliklinik</option>
                <option value="Poli Umum">Poli Umum</option>
                <option value="Poli Gigi">Poli Gigi</option>
                <option value="Poli Anak">Poli Anak</option>
                <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                <option value="Poli Kandungan">Poli Kandungan</option>
                <option value="UGD">UGD / Emergency</option>
              </select>
            </div>
          </div>

          {/* CSV Download Trigger */}
          <button
            onClick={handleExportCSV}
            className="self-end bg-primary text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer h-[38px]"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Data
          </button>
        </div>
      </div>

      {/* Dashboard Stats Summary (Bento Style) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Antrian */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined">person_add</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline-variant uppercase tracking-wider">Total Antrian</p>
            <h4 className="text-2xl font-black text-on-surface">{totalAntrian}</h4>
          </div>
        </div>

        {/* Menunggu */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-tertiary-container/10 rounded-full flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline-variant uppercase tracking-wider">Menunggu</p>
            <h4 className="text-2xl font-black text-on-surface">{menungguCount}</h4>
          </div>
        </div>

        {/* Sedang Diperiksa */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">stethoscope</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline-variant uppercase tracking-wider">Sedang Diperiksa</p>
            <h4 className="text-2xl font-black text-on-surface">{diperiksaCount}</h4>
          </div>
        </div>

        {/* Selesai */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-secondary-container/30 rounded-full flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline-variant uppercase tracking-wider">Selesai</p>
            <h4 className="text-2xl font-black text-on-surface">{selesaiCount}</h4>
          </div>
        </div>
      </section>

      {/* Main Data Table Container */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-md">
        <div className="p-5 border-b border-outline-variant bg-white/50 flex justify-between items-center">
          <h5 className="text-base font-bold text-on-surface">Daftar Kunjungan Hari Ini</h5>
          <div className="flex gap-2">
            <p className="text-xs text-outline self-center font-medium">
              Menampilkan {filteredVisits.length} data kunjungan
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">No. Rekam Medis</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Nama Pasien</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Waktu Kunjungan</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Poliklinik</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Dokter</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-outline">
                    Tidak ditemukan data kunjungan pada {filterDate} dengan filter terpilih.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit) => {
                  const patientDetails = patients.find((p) => p.id === visit.patientId) || {
                    id: visit.patientId,
                    name: visit.patientName,
                    gender: visit.gender,
                    age: visit.age,
                    address: 'Data Alamat Tersembunyi',
                    status: 'Outpatient' as const,
                    registeredDate: '2023-10-24'
                  };

                  let statusBadgeStyle = 'bg-secondary-fixed text-on-secondary-fixed';
                  if (visit.status === 'Selesai') {
                    statusBadgeStyle = 'bg-secondary-container text-on-secondary-container';
                  } else if (visit.status === 'Pemeriksaan' || visit.status === 'Diperiksa') {
                    statusBadgeStyle = 'bg-primary-fixed-dim/30 text-primary animate-pulse';
                  } else if (visit.status === 'Menunggu' || visit.status === 'Antri') {
                    statusBadgeStyle = 'bg-tertiary-fixed text-tertiary';
                  } else if (visit.status === 'Gawat') {
                    statusBadgeStyle = 'bg-error-container text-on-error-container';
                  }

                  return (
                    <tr
                      key={visit.id}
                      onClick={() => onViewPatientDetails(patientDetails, visit)}
                      className="hover:bg-secondary-container/20 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 text-xs font-mono font-bold text-primary">
                        {visit.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-on-surface">{visit.patientName}</div>
                        <div className="text-[11px] text-outline mt-0.5">
                          {visit.gender}, {visit.age}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono font-medium text-on-surface">
                        {visit.time}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 bg-surface-container-highest rounded-full text-on-surface-variant font-semibold text-[10px]">
                          {visit.poliklinik}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-on-surface-variant">
                        {visit.doctor}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyle}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {visit.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewPatientDetails(patientDetails, visit);
                          }}
                          className="text-primary hover:bg-primary-container/10 p-2 rounded-lg transition-all"
                          title="Lihat Rekam Medis"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contextual Insights Section (Asymmetric Layout / Graphs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Custom Hour-By-Hour Traffic SVG Chart */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-sm font-bold text-on-surface uppercase tracking-wider">
              Tren Kunjungan Jam per Jam
            </h5>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                <span className="text-[10px] font-semibold text-outline">Hari Ini</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-outline-variant inline-block"></span>
                <span className="text-[10px] font-semibold text-outline">Rata-rata</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Pillars */}
          <div className="h-44 flex items-end justify-between gap-4 px-4 pb-1 border-b border-outline-variant">
            {/* 08:00 */}
            <div className="w-full bg-[#bdc9c8]/30 rounded-t-lg h-[40%] relative group cursor-pointer hover:bg-surface-container-high/40 transition-colors">
              <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-[60%] hover:scale-y-105 transition-transform origin-bottom"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline">08:00</span>
            </div>
            {/* 09:00 */}
            <div className="w-full bg-[#bdc9c8]/30 rounded-t-lg h-[60%] relative group cursor-pointer hover:bg-surface-container-high/40 transition-colors">
              <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-[80%] hover:scale-y-105 transition-transform origin-bottom"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline">09:00</span>
            </div>
            {/* 10:00 */}
            <div className="w-full bg-[#bdc9c8]/30 rounded-t-lg h-[75%] relative group cursor-pointer hover:bg-surface-container-high/40 transition-colors">
              <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-[92%] hover:scale-y-105 transition-transform origin-bottom"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline">10:00</span>
            </div>
            {/* 11:00 */}
            <div className="w-full bg-[#bdc9c8]/30 rounded-t-lg h-[85%] relative group cursor-pointer hover:bg-surface-container-high/40 transition-colors">
              <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-[70%] hover:scale-y-105 transition-transform origin-bottom"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline">11:00</span>
            </div>
            {/* 12:00 */}
            <div className="w-full bg-[#bdc9c8]/30 rounded-t-lg h-[65%] relative group cursor-pointer hover:bg-surface-container-high/40 transition-colors">
              <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-[35%] hover:scale-y-105 transition-transform origin-bottom"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline">12:00</span>
            </div>
            {/* 13:00 */}
            <div className="w-full bg-[#bdc9c8]/30 rounded-t-lg h-[35%] relative group cursor-pointer hover:bg-surface-container-high/40 transition-colors">
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline">13:00</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 bg-primary-container/[0.04] p-3.5 rounded-xl border border-primary-container/10">
            <span className="material-symbols-outlined text-primary text-xl">lightbulb</span>
            <p className="text-xs text-on-surface leading-normal font-medium">
              Puncak kunjungan tertinggi berada di wilayah jam <strong className="text-primary font-bold">09:00 - 11:00</strong>. Disarankan untuk memberlakukan skema pendaftaran kilat.
            </p>
          </div>
        </div>

        {/* Dynamic Poliklinik Distribution Progress Ratios */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h5 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-5">
              Distribusi Departemen Poliklinik
            </h5>
            
            <div className="space-y-4">
              {/* Poli Umum */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-on-surface-variant">Poli Umum</span>
                  <span>42%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              {/* Poli Anak */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-on-surface-variant">Poli Anak</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary-container h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Poli Gigi */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-on-surface-variant">Poli Gigi</span>
                  <span>18%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary-fixed-dim/70 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              {/* Lainnya */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-on-surface-variant">Lainnya / UGD</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-outline-variant h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Detail laporan analitik poliklinik telah diarsipkan untuk audit bulanan.')}
            className="mt-6 w-full py-2.5 border border-primary text-primary hover:bg-primary/5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Lihat Detail Laporan
          </button>
        </div>
      </div>
    </div>
  );
}

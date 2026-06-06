import React, { useState } from "react";
import { Patient, Visit } from "../types";

interface DataPasienViewProps {
  patients: Patient[];
  visits: Visit[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onAddPatient: (newPatient: Patient) => void;
  onViewPatientDetails: (patient: Patient, visit?: Visit) => void;
  showAddPatientModal: boolean;
  onCloseAddPatientModal: () => void;
  onOpenAddPatientModal: () => void;
}

export default function DataPasienView({
  patients,
  visits,
  searchQuery,
  onSearchQueryChange,
  onAddPatient,
  onViewPatientDetails,
  showAddPatientModal,
  onCloseAddPatientModal,
  onOpenAddPatientModal,
}: DataPasienViewProps) {
  const [statusFilter, setStatusFilter] = useState<"All" | Patient["status"]>(
    "All",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formGender, setFormGender] = useState<"Laki-laki" | "Perempuan" | "">(
    "",
  );
  const [formAge, setFormAge] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formStatus, setFormStatus] = useState<Patient["status"] | "">("");
  const [formError, setFormError] = useState("");

  // Handle addition of a new patient record
  const handleSubmitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formName.trim() ||
      !formGender ||
      !formAge.trim() ||
      !formAddress.trim() ||
      !formStatus
    ) {
      setFormError(
        "Harap lengkapi semua field termasuk Jenis Kelamin dan Metode Perawatan.",
      );
      return;
    }
    setFormError("");

    const formattedId = `#PT-2024-00${patients.length + 1}`;
    const newPatientObj: Patient = {
      id: formattedId,
      name: formName,
      gender: formGender as "Laki-laki" | "Perempuan",
      age:
        formAge.endsWith("th") || formAge.includes("Thn")
          ? formAge
          : `${formAge}th`,
      address: formAddress,
      phone: formPhone || "0812-xxxx-xxxx",
      status: formStatus as Patient["status"],
      registeredDate: new Date().toISOString().substring(0, 10),
    };

    onAddPatient(newPatientObj);

    // Reset Form
    setFormName("");
    setFormGender("");
    setFormAge("");
    setFormPhone("");
    setFormAddress("");
    setFormStatus("");
    onCloseAddPatientModal();
  };

  // Compile CSV for patients
  const handleExportCSV = () => {
    const header =
      "ID Pasien,Nama Pasien,Jenis Kelamin,Usia,Alamat,Nomor Hp,Status,Tanggal Registrasi\r\n";
    const rows = patients
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.gender}","${p.age}","${p.address}","${p.phone || ""}","${p.status}","${p.registeredDate}"`,
      )
      .join("\r\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Catalog_Pasien_SIMRSUD.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search & Status Filter
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !normalizedSearch ||
      p.name.toLowerCase().includes(normalizedSearch) ||
      p.id.toLowerCase().includes(normalizedSearch) ||
      p.address.toLowerCase().includes(normalizedSearch) ||
      p.gender.toLowerCase().includes(normalizedSearch) ||
      p.status.toLowerCase().includes(normalizedSearch);

    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Stats Header Bento style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Overview Information */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-primary">
              Patient Registry Overview
            </h3>
            <p className="text-xs text-on-surface-variant">
              Akses dan kelola basis data pasien terpusat untuk seluruh unit dan
              poliklinik RSUD.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="text-center px-4 border-r border-outline-variant">
              <p className="text-2xl font-black text-primary">
                {patients.length}
              </p>
              <p className="text-[9px] font-bold text-outline uppercase tracking-wider">
                TOTAL PASIEN
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-black text-secondary">
                {patients.filter((p) => p.registeredDate === new Date().toISOString().substring(0, 10)).length}
              </p>
              <p className="text-[9px] font-bold text-outline uppercase tracking-wider">
                TERDAFTAR HARI INI
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Patient Addition Anchor */}
        <div className="lg:col-span-4 bg-primary text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] opacity-15 transform rotate-12 group-hover:scale-110 transition-transform">
            <span
              className="material-symbols-outlined text-8xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              patient_list
            </span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person_add
            </span>
            <button
              onClick={onOpenAddPatientModal}
              className="bg-white text-primary px-5 py-2 rounded-xl text-xs font-bold hover:bg-opacity-95 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Add Patient
            </button>
          </div>
          <p className="text-sm font-semibold mt-4 leading-snug">
            Daftarkan pasien medis baru langsung ke sistem SIMRSUD RSUD.
          </p>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-md">
        {/* Table Filter Actions Bar */}
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2.5">
            {/* Status quick select */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border border-outline rounded-xl text-xs bg-white px-3 py-1.5 focus:outline-none focus:border-primary font-medium"
            >
              <option value="All">Semua Status</option>
              <option value="Inpatient">Inpatient (Rawat Inap)</option>
              <option value="Outpatient">Outpatient (Rawat Jalan)</option>
              <option value="Critical">Critical (Gawat)</option>
              <option value="Discharged">Discharged (Selesai)</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-outline text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high/50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Export CSV
            </button>
          </div>

          {/* Simple Pagination bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-outline font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container-high transition-all disabled:opacity-40 select-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((c) => Math.min(c + 1, totalPages))
                }
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container-high transition-all disabled:opacity-40 select-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* React Patients Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">
                  Age
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">
                  Address
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-outline"
                  >
                    Tidak ditemukan data pasien yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((p) => {
                  const initialBadge = p.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  let statusBadgeClass =
                    "bg-secondary-fixed text-on-secondary-fixed";
                  if (p.status === "Inpatient") {
                    statusBadgeClass =
                      "bg-secondary-container text-on-secondary-container";
                  } else if (p.status === "Outpatient") {
                    statusBadgeClass =
                      "bg-surface-variant text-on-surface-variant";
                  } else if (p.status === "Critical") {
                    statusBadgeClass =
                      "bg-error-container text-on-error-container font-black";
                  } else if (p.status === "Discharged") {
                    statusBadgeClass =
                      "bg-tertiary-fixed text-on-tertiary-fixed";
                  }

                  // Find visit link
                  const linkedVisit = visits.find((v) => v.patientId === p.id);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-secondary-container/15 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">
                        {p.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#c8e7d8] flex items-center justify-center text-primary font-bold text-xs shadow-sm">
                            {initialBadge}
                          </div>
                          <span className="font-semibold text-sm text-on-surface">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-on-surface-variant font-medium">
                        {p.gender}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-on-surface-variant font-medium">
                        {p.age}
                      </td>
                      <td
                        className="px-5 py-3.5 text-xs text-outline truncate max-w-sm"
                        title={p.address}
                      >
                        {p.address}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${statusBadgeClass}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => onViewPatientDetails(p, linkedVisit)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
                            title="Detail Dossier"
                          >
                            <span className="material-symbols-outlined text-sm">
                              visibility
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Quick Information Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">history</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">
              Recent Changes
            </h4>
            <p className="text-xs text-outline mt-0.5">Updated 15 mins ago</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-2xl">
              cloud_sync
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">System Sync</h4>
            <p className="text-xs text-outline mt-0.5">All nodes active</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-2xl">security</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Data Privacy</h4>
            <p className="text-xs text-outline mt-0.5">
              HIPAA Compliant System
            </p>
          </div>
        </div>
      </div>

      {/* Add Resident Form Modal Container */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant overflow-hidden animate-card-scale">
            <div className="bg-primary p-5 text-white flex justify-between items-center">
              <span className="text-sm uppercase tracking-wider font-bold">
                Registrasi Pasien Baru
              </span>
              <button
                onClick={onCloseAddPatientModal}
                className="text-white/80 hover:text-white hover:bg-white/15 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={handleSubmitNewPatient}
              className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {formError && (
                <div className="p-3 bg-error-container text-on-error-container text-xs font-bold rounded-lg leading-relaxed">
                  {formError}
                </div>
              )}

              {/* Patient Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Bambang Santoso"
                  className="border border-outline-variant rounded-xl p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              {/* Gender and Age */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="border border-outline-variant rounded-xl p-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                    Usia / Umur
                  </label>
                  <input
                    type="text"
                    required
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="e.g. 45 Thn"
                    className="border border-outline-variant rounded-xl p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Phone text fields */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                  Nomor HP / Whatsapp
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. 0812-3456-xxxx"
                  className="border border-outline-variant rounded-xl p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              {/* General classification status */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                  Metode Perawatan
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="border border-outline-variant rounded-xl p-2.5 text-xs outline-none focus:border-primary font-medium"
                >
                  <option value="">Pilih Metode Perawatan</option>
                  <option value="Outpatient">Outpatient (Rawat Jalan)</option>
                  <option value="Inpatient">Inpatient (Rawat Inap)</option>
                  <option value="Critical">Critical / Check Up Rutin</option>
                </select>
              </div>

              {/* Address Area */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                  Alamat Tinggal Lengka
                </label>
                <textarea
                  rows={2}
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. Jalan Merpati Raya No. 4, Jakarta Timur"
                  className="border border-outline-variant rounded-xl p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onCloseAddPatientModal}
                  className="px-4 py-2 border border-outline rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container cursor-pointer transition-colors"
                >
                  Simpan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

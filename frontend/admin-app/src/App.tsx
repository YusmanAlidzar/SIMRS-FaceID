import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import KunjunganHarianView from "./components/KunjunganHarianView";
import DataPasienView from "./components/DataPasienView";
import LoginView from "./components/LoginView";
import PatientDetailsModal from "./components/PatientDetailsModal";

import { Patient, Visit, NotificationItem } from "./types";
import {
  INITIAL_PATIENTS,
  INITIAL_VISITS,
  INITIAL_NOTIFICATIONS,
} from "./mockData";

export default function App() {
  // Session User Role (null implies requiring Login)
  const [user, setUser] = useState<{
    username: string;
    avatarUrl: string;
  } | null>(null);

  // Active navigation view tab
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "visits" | "patients"
  >("dashboard");

  // Unified Data States
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );

  // Search filter query (handled in the Header search inputs)
  const [searchQuery, setSearchQuery] = useState("");

  // Modals / Details focus states
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Handle successful login
  const handleLoginSuccess = (profile: {
    username: string;
    avatarUrl: string;
  }) => {
    setUser(profile);
  };

  // Log out of session
  const handleLogout = () => {
    setUser(null);
    setActiveTab("dashboard");
  };

  // Register a patient and automatically queue a visit for them
  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);

    // Create a corresponding visit
    const indexSuffix = visits.length + 101;
    const todayDate = new Date().toISOString().split("T")[0];
    const associatedVisit: Visit = {
      id: `RM-2023-00${indexSuffix}`,
      patientId: newPatient.id,
      patientName: newPatient.name,
      gender: newPatient.gender,
      age: newPatient.age,
      time: "10:30 WIB",
      poliklinik: "Poli Umum",
      doctor: "Dr. Andi Pratama",
      status: "Antri",
      date: todayDate,
    };

    setVisits((prev) => [associatedVisit, ...prev]);

    // Push system alert notification
    const newAlert: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Pasien Baru Terdaftar",
      description: `${newPatient.name} telah didaftarkan ke Poli Umum.`,
      type: "info",
      time: "Just now",
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  // Clear system alert log
  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Edit general patient classification status from modal
  const handleUpdatePatientStatus = (
    patientId: string,
    newStatus: Patient["status"],
  ) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p)),
    );
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
  };

  // Edit daily visit status indicator from the diagnostic modal
  const handleUpdateVisitStatus = (
    visitId: string,
    newStatus: Visit["status"],
  ) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: newStatus } : v)),
    );
    if (selectedVisit && selectedVisit.id === visitId) {
      setSelectedVisit((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
  };

  // View details binder
  const handleViewPatientDetails = (patient: Patient, visit?: Visit) => {
    setSelectedPatient(patient);
    setSelectedVisit(visit || null);
  };

  if (!user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Determine App Bar Title based on active tab
  let pageTitle = "Dashboard";
  let searchPlaceholder = "Cari data di dashboard...";
  if (activeTab === "visits") {
    pageTitle = "Kunjungan Harian";
    searchPlaceholder = "Cari berdasarkan no rekam medis, dokter...";
  } else if (activeTab === "patients") {
    pageTitle = "Data Pasien";
    searchPlaceholder = "Cari nama pasien, ID, alamat...";
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Sidebar Navigation Panel */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery(""); // Reset search when switching tabs
        }}
        onLogout={handleLogout}
        userRole={user}
      />

      {/* Top App Utility Bar */}
      <Header
        title={pageTitle}
        onSearchChange={setSearchQuery}
        searchPlaceholder={searchPlaceholder}
        userRole={user}
        notifications={notifications}
        onClearNotification={handleClearNotification}
      />

      {/* Primary Inner Canvas */}
      <main className="ml-[260px] pt-16 min-h-screen p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              patients={patients}
              visits={visits}
              notifications={notifications}
              searchQuery={searchQuery}
              onOpenAddPatient={() => {
                setActiveTab("patients");
                setShowAddPatientModal(true);
              }}
              onClearNotification={handleClearNotification}
              onViewPatientDetails={handleViewPatientDetails}
              onTabChange={setActiveTab}
            />
          )}

          {activeTab === "visits" && (
            <KunjunganHarianView
              visits={visits}
              patients={patients}
              searchQuery={searchQuery}
              onViewPatientDetails={handleViewPatientDetails}
            />
          )}

          {activeTab === "patients" && (
            <DataPasienView
              patients={patients}
              visits={visits}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onAddPatient={handleAddPatient}
              onViewPatientDetails={handleViewPatientDetails}
              showAddPatientModal={showAddPatientModal}
              onOpenAddPatientModal={() => setShowAddPatientModal(true)}
              onCloseAddPatientModal={() => setShowAddPatientModal(false)}
            />
          )}
        </div>
      </main>

      {/* Patient Profile Dossier Dialog details */}
      <PatientDetailsModal
        patient={selectedPatient}
        visit={selectedVisit}
        onClose={() => {
          setSelectedPatient(null);
          setSelectedVisit(null);
        }}
        onUpdateStatus={handleUpdatePatientStatus}
        onUpdateVisitStatus={handleUpdateVisitStatus}
      />
    </div>
  );
}

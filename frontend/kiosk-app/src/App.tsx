import React, { useRef, useState } from "react";
import { 
  ScreenType, PatientInfo, Poliklinik, POLIKLINIK_LIST 
} from "./types";
import { registerPatient, generateQueueTicket } from "./api";
import WelcomeScreen from "./components/WelcomeScreen";
import PolySelectionModal from "./components/PolySelectionModal";
import MethodChoiceScreen from "./components/MethodChoiceScreen";
import LoginChoiceScreen from "./components/LoginChoiceScreen";
import IdentityForm from "./components/IdentityForm";
import FaceScanView from "./components/FaceScanView";
import RegistrationReview from "./components/RegistrationReview";
import ConfirmationScreen from "./components/ConfirmationScreen";
import SuccessScreen from "./components/SuccessScreen";

// Default default patient info
const DEFAULT_PATIENT: PatientInfo = {
  nama: "Budi Santoso",
  nik: "3273012903930005",
  tanggalLahir: "1993-06-12",
  jenisKelamin: "Laki-laki",
  telepon: "081298765432",
  alamat: "Jalan Cempaka Putih No. 45, RT 02/RW 04, Jakarta Pusat",
  photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
  poly: "",
  dokter: "",
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("INITIAL_WELCOME");
  const [selectedPoly, setSelectedPoly] = useState<Poliklinik | null>(null);
  const [isPolySelectorOpen, setIsPolySelectorOpen] = useState(false);
  const [selectPolyAlert, setSelectPolyAlert] = useState<string | null>(null);
  
  // Start registration handler: if no poly selected, open selector first
  const handleStartRegistration = () => {
    if (!selectedPoly) {
      setIsPolySelectorOpen(true);
      setSelectPolyAlert("Silakan pilih poli terlebih dahulu");
      // auto-dismiss after a short delay
      window.setTimeout(() => setSelectPolyAlert(null), 3500);
    } else {
      setCurrentScreen("METHOD_CHOICE");
    }
  };
  
  // Storage for currently entered patient data
  const [patientData, setPatientData] = useState<PatientInfo>({ ...DEFAULT_PATIENT });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  // Handle department/poly selection from the modal
  const handleSelectPoly = (poly: Poliklinik) => {
    setSelectedPoly(poly);
    setIsPolySelectorOpen(false);
    
    // Check specific navigation trigger for Poli Psikiatri
    if (poly.id === "poly-psikiatri") {
      setCurrentScreen("PSIKIATRI_WELCOME");
    } else {
      setCurrentScreen("INITIAL_WELCOME");
    }
  };

  // Helper to completely reset the checkout application flow
  const handleReset = () => {
    setCurrentScreen("INITIAL_WELCOME");
    setSelectedPoly(null);
    setPatientData({ ...DEFAULT_PATIENT });
    setIsSubmitting(false);
    submitLockRef.current = false;
  };

  const getPatientAge = (birthDate: string) => {
    if (!birthDate) return undefined;
    const parsed = new Date(birthDate);
    if (Number.isNaN(parsed.getTime())) return undefined;
    const today = new Date();
    let age = today.getFullYear() - parsed.getFullYear();
    const monthDiff = today.getMonth() - parsed.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsed.getDate())) {
      age -= 1;
    }
    return age >= 0 ? age : undefined;
  };

  const normalizeKioskGender = (gender: string) => {
    return gender === "L" || gender === "l" ? "Laki-laki" : gender === "P" || gender === "p" ? "Perempuan" : gender;
  };

  const handleRegisterAndQueue = async (skipTicketPage = false) => {
    if (!selectedPoly) {
      setCurrentScreen("INITIAL_WELCOME");
      return false;
    }

    if (submitLockRef.current) {
      return false;
    }

    submitLockRef.current = true;

    setIsSubmitting(true);
    try {
      const formattedGender = normalizeKioskGender(patientData.jenisKelamin);
      const payload = {
        id: patientData.nik,
        name: patientData.nama,
        nik: patientData.nik,
        gender: formattedGender,
        birth_date: patientData.tanggalLahir,
        address: patientData.alamat,
        phone: patientData.telepon,
        photo_url: patientData.photoUrl,
        face_encoding: null,
      };

      try {
        await registerPatient(payload);
      } catch (err: any) {
        if (!err.message.includes('Patient already exists')) {
          console.error('Registration error', err);
          throw err;
        }
      }

      const queueResponse = await generateQueueTicket({
        patient_id: patientData.nik,
        poliklinik_id: selectedPoly.id,
        visit_date: new Date().toISOString().split('T')[0],
      });

      setPatientData((prev) => ({
        ...prev,
        ticketId: queueResponse.ticket?.ticketId,
        queueNumber: queueResponse.ticket?.queueNumber,
        visitDate: queueResponse.ticket?.visitDate,
        visitTime: queueResponse.ticket?.visitTime,
        ticketDoctor: queueResponse.ticket?.doctor,
      }));

      if (!skipTicketPage) {
        setCurrentScreen('TICKET_CONFIRMATION');
      }
      return true;
    } catch (error) {
      console.error('Failed to register and queue patient:', error);
      window.alert('Gagal menghubungkan ke server. Silakan coba lagi.');
      return false;
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  const handleConfirmTicket = async () => {
    if (patientData.ticketId && patientData.queueNumber) {
      setCurrentScreen('SUCCESS_PAGE');
      return;
    }

    const succeeded = await handleRegisterAndQueue(true);
    if (succeeded) {
      setCurrentScreen('SUCCESS_PAGE');
    }
  };

  // Screen state router render
  const renderScreen = () => {
    switch (currentScreen) {
      
      case "INITIAL_WELCOME":
        return (
          <WelcomeScreen
            selectedPoly={selectedPoly}
            onOpenPolySelector={() => setIsPolySelectorOpen(true)}
            onStartRegistration={handleStartRegistration}
            alertMessage={selectPolyAlert}
          />
        );

      case "PSIKIATRI_WELCOME":
        return (
          <WelcomeScreen
            selectedPoly={selectedPoly}
            onOpenPolySelector={() => setIsPolySelectorOpen(true)}
            onStartRegistration={handleStartRegistration}
            isPsikiatriSpecial={true}
            alertMessage={selectPolyAlert}
          />
        );

      case "METHOD_CHOICE":
        return (
          <MethodChoiceScreen
            selectedPoly={selectedPoly}
            onSelectLogin={() => setCurrentScreen("LOGIN_CHOICE")}
            onSelectRegister={() => setCurrentScreen("REGISTER_FORM")}
            onBack={() => setCurrentScreen("INITIAL_WELCOME")}
          />
        );

      case "LOGIN_CHOICE":
        return (
          <LoginChoiceScreen
            selectedPoly={selectedPoly}
            onSelectFaceScan={() => setCurrentScreen("GENERAL_FACE_SCAN")}
            onSelectManualInput={() => setCurrentScreen("MANUAL_FORM")}
            onBack={() => setCurrentScreen("METHOD_CHOICE")}
          />
        );

      case "MANUAL_FORM":
        return (
          <IdentityForm
            selectedPoly={selectedPoly}
            mode="MANUAL_LOGIN"
            initialData={patientData}
            onBack={() => setCurrentScreen("LOGIN_CHOICE")}
            onSubmit={(data) => {
              setPatientData(data);
              setCurrentScreen("TICKET_CONFIRMATION");
            }}
          />
        );

      case "REGISTER_FORM":
        return (
          <IdentityForm
            selectedPoly={selectedPoly}
            mode="REGISTER"
            initialData={patientData}
            onBack={() => setCurrentScreen("METHOD_CHOICE")}
            onGoToFaceScan={(data) => {
              setPatientData(data);
              setCurrentScreen("FACE_REGISTRATION");
            }}
            onSubmit={(data) => {
              setPatientData(data);
              // Flow specifies "button simpan leads back to Welcome Screen"
              setCurrentScreen("INITIAL_WELCOME");
            }}
          />
        );

      case "FACE_REGISTRATION":
        return (
          <FaceScanView
            selectedPoly={selectedPoly}
            title="Pendaftaran Biometrik Wajah"
            isRegistrationFlow={true}
            onBack={() => setCurrentScreen("REGISTER_FORM")}
            onManual={() => setCurrentScreen("REGISTER_FORM")}
            onScanComplete={(url) => {
              setPatientData((prev) => ({ ...prev, photoUrl: url }));
              setCurrentScreen("REGISTRATION_REVIEW");
            }}
          />
        );

      case "REGISTRATION_REVIEW":
        return (
          <RegistrationReview
            selectedPoly={selectedPoly}
            patientData={patientData}
            onBack={() => setCurrentScreen("REGISTER_FORM")}
            onRetakeFacePhoto={() => setCurrentScreen("FACE_REGISTRATION")}
            isSubmitting={isSubmitting}
            onConfirm={handleRegisterAndQueue}
          />
        );

      case "GENERAL_FACE_SCAN":
        return (
          <FaceScanView
            selectedPoly={selectedPoly}
            onBack={() => setCurrentScreen("LOGIN_CHOICE")}
            onManual={() => setCurrentScreen("MANUAL_FORM")}
            onScanComplete={(url) => {
              setPatientData((prev) => ({ ...prev, photoUrl: url }));
              // Check if they came from Registration Review
              if (currentScreen === "REGISTRATION_REVIEW") {
                setCurrentScreen("REGISTRATION_REVIEW");
              } else {
                setCurrentScreen("TICKET_CONFIRMATION");
              }
            }}
          />
        );

      case "TICKET_CONFIRMATION":
        return (
          <ConfirmationScreen
            selectedPoly={selectedPoly}
            patientData={patientData}
            onCancel={() => setCurrentScreen("LOGIN_CHOICE")}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmTicket}
          />
        );

      case "SUCCESS_PAGE":
        return (
          <SuccessScreen
            selectedPoly={selectedPoly}
            patientData={patientData}
            onFinish={handleReset}
          />
        );

      default:
        return (
          <WelcomeScreen
            selectedPoly={selectedPoly}
            onOpenPolySelector={() => setIsPolySelectorOpen(true)}
            onStartRegistration={handleStartRegistration}
            alertMessage={selectPolyAlert}
          />
        );
    }
  };

  return (
    <div className="App selection:bg-teal-500 selection:text-white" id="main-app-container">
      {renderScreen()}

      {/* Persistent global overlay component for selecting Poliklinik */}
      {isPolySelectorOpen && (
        <PolySelectionModal
          onSelectPoly={handleSelectPoly}
          onClose={() => setIsPolySelectorOpen(false)}
        />
      )}
    </div>
  );
}

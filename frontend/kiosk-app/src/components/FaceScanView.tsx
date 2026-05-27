import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Save, ShieldAlert } from "lucide-react";
import { Poliklinik } from "../types";
import Header from "./Header";

interface FaceScanViewProps {
  selectedPoly: Poliklinik | null;
  onBack: () => void;
  onScanComplete: (photoPreviewUrl: string) => void;
  title?: string;
  isRegistrationFlow?: boolean;
}

export default function FaceScanView({
  selectedPoly,
  onBack,
  onScanComplete,
  title = "Pemindaian Face ID Pasien",
  isRegistrationFlow = false,
}: FaceScanViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  
  const [scanState, setScanState] = useState<"IDLE" | "SCANNING" | "COMPLETED">("IDLE");
  const [statusText, setStatusText] = useState("Memuat sistem biometrik offline...");

  // 1. Memuat Model AI (Offline) saat komponen dirender
  useEffect(() => {
    const loadModelsAndStart = async () => {
      try {
        // @ts-ignore - Mengabaikan error TS karena faceapi di-load via script tag global
        const faceapi = window.faceapi;
        if (!faceapi) throw new Error("Library face-api belum termuat!");

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        ]);
        
        setStatusText("Model Siap. Menghubungkan kamera...");
        startCamera();
      } catch (err) {
        setStatusText("Gagal memuat model. Hubungi Petugas.");
        console.error(err);
      }
    };
    loadModelsAndStart();
  }, []);

  // 2. Fungsi menyalakan kamera (Dengan Pengaman Secure Context)
  const startCamera = () => {
    // Pengaman: Cek apakah browser memblokir akses media (karena bukan HTTPS/Localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatusText("Error: Kamera diblokir! Pastikan menggunakan http://localhost atau HTTPS.");
      console.error("navigator.mediaDevices tidak ditemukan. Browser memblokir akses karena alasan keamanan (Bukan Secure Context).");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { width: 720, height: 560 } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        setStatusText("Akses Kamera Ditolak / Tidak Ditemukan.");
        console.error("Gagal menyalakan kamera:", err);
      });
  };

  // 3. Logika Deteksi Wajah saat video mulai diputar
  const handleVideoPlaying = () => {
    setScanState("SCANNING");
    setStatusText("Posisi wajah di tengah kotak. Tahan...");
    
    // @ts-ignore
    const faceapi = window.faceapi;
    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    
    if (canvasContainerRef.current) {
      canvasContainerRef.current.appendChild(canvas);
    }
    
    const displaySize = { width: videoRef.current!.clientWidth, height: videoRef.current!.clientHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const scanInterval = setInterval(async () => {
      if (!videoRef.current || scanState === "COMPLETED") return;

      const detections = await faceapi.detectAllFaces(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();
      
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      
      // Menggambar UI Deteksi (Kotak dan Garis)
      faceapi.draw.drawDetections(canvas, resizedDetections);

      // Jika wajah stabil terdeteksi, kita asumsikan selesai (Simulasi)
      if(detections.length > 0) {
        setStatusText("Wajah Teridentifikasi!");
        setScanState("COMPLETED");
        clearInterval(scanInterval);
      }
    }, 150);
  };

  const handleContinue = () => {
    // Simulasi mengirim URL foto sementara ke komponen berikutnya
    onScanComplete("https://via.placeholder.com/150"); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 md:p-10">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <Header selectedPoly={selectedPoly} onReset={onBack} />
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-display text-slate-800">{title}</h2>
            <p className="text-sm font-semibold text-amber-600 bg-amber-50 py-2 mt-2 rounded-lg">
              Status: {statusText}
            </p>
          </div>

          {/* Area Kamera */}
          <div className="relative mx-auto rounded-2xl overflow-hidden border-4 border-slate-200 bg-black w-[640px] h-[480px]" ref={canvasContainerRef}>
            <video 
              ref={videoRef} 
              onPlaying={handleVideoPlaying} 
              autoPlay 
              muted 
              className="w-full h-full object-cover"
            />
            
            {scanState === "COMPLETED" && (
              <div className="absolute inset-0 bg-teal-500/20 border-4 border-teal-500 flex items-center justify-center">
                <span className="bg-teal-500 text-white font-bold px-6 py-2 rounded-full text-lg shadow-lg">
                  SCAN BERHASIL
                </span>
              </div>
            )}
          </div>

          {/* Tombol Aksi Bawah */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
             <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Ulangi
             </button>

             <button 
                onClick={handleContinue}
                disabled={scanState !== "COMPLETED"}
                className={`px-8 py-3 font-bold rounded-xl flex items-center gap-2 transition ${scanState === "COMPLETED" ? "bg-[#1B1B1B] text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
             >
                <Save className="w-4 h-4" /> Simpan & Lanjutkan
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
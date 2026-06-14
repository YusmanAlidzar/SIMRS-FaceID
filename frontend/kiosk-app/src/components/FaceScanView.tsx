import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Save, ShieldAlert } from "lucide-react";
import { Poliklinik } from "../types";
import Header from "./Header";

interface FaceScanViewProps {
  selectedPoly: Poliklinik | null;
  onBack: () => void;
  onScanComplete: (photoPreviewUrl: string) => void;
  onManual?: () => void;
  title?: string;
  isRegistrationFlow?: boolean;
}

export default function FaceScanView({
  selectedPoly,
  onBack,
  onScanComplete,
  onManual,
  title = "Pemindaian Face ID Pasien",
  isRegistrationFlow = false,
}: FaceScanViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const captureLockRef = useRef(false);
  
  const [scanState, setScanState] = useState<"IDLE" | "SCANNING" | "COMPLETED">("IDLE");
  const [statusText, setStatusText] = useState("Memuat sistem biometrik offline...");
  const [scanAligned, setScanAligned] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const FACE_DETECTION_THRESHOLD = 0.5;

  const clearScanInterval = () => {
    if (scanIntervalRef.current !== null) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const stopCameraStream = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const stream = video.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      video.srcObject = null;
    } catch (e) {
      console.warn('Failed to stop camera stream', e);
    }
  };

  const removeExistingCanvas = () => {
    if (!canvasContainerRef.current) return;
    const existingCanvas = canvasContainerRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }
  };

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
          videoRef.current.play().catch(() => {});
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
    setScanAligned(false);
    setStatusText("Posisi wajah di tengah kotak. Tahan...");
    captureLockRef.current = false;
    
    clearScanInterval();
    removeExistingCanvas();

    // @ts-ignore
    const faceapi = window.faceapi;
    const video = videoRef.current;
    if (!video) {
      setStatusText("Kamera belum siap. Coba lagi.");
      return;
    }

    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.transform = 'scaleX(-1)';
    
    if (canvasContainerRef.current) {
      canvasContainerRef.current.appendChild(canvas);
    }
    
    const displaySize = { width: video.clientWidth, height: video.clientHeight };
    faceapi.matchDimensions(canvas, displaySize);

    scanIntervalRef.current = window.setInterval(async () => {
      const activeVideo = videoRef.current;
      if (!activeVideo || captureLockRef.current) return;

      const detectionOptions = new faceapi.TinyFaceDetectorOptions({ scoreThreshold: FACE_DETECTION_THRESHOLD });
      const detections = await faceapi.detectAllFaces(
        activeVideo, 
        detectionOptions
      ).withFaceLandmarks();
      
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvas.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);

      if (resizedDetections.length > 0) {
        faceapi.draw.drawDetections(canvas, resizedDetections);
      }
      
      if (detections.length > 0 && resizedDetections.length > 0) {
        const box = resizedDetections[0].detection.box;
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        const frameW = displaySize.width;
        const frameH = displaySize.height;
        const isCentered = Math.abs(centerX - frameW / 2) < frameW * 0.14 && Math.abs(centerY - frameH / 2) < frameH * 0.16;
        const isHeightValid = box.height >= frameH * 0.32 && box.height <= frameH * 0.72;
        const isWidthValid = box.width >= frameW * 0.26 && box.width <= frameW * 0.65;
        const isValidFace = isCentered && isHeightValid && isWidthValid;

        if (isValidFace) {
          captureLockRef.current = true;
          clearScanInterval();
          setScanAligned(true);
          setStatusText("Wajah sudah sesuai petunjuk scan. Mengambil foto...");

          // Capture current video frame
          const captureVideo = videoRef.current;
          if (!captureVideo) {
            captureLockRef.current = false;
            setStatusText("Kamera tidak tersedia. Silakan ulangi scan.");
            return;
          }

          const tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = captureVideo.videoWidth || displaySize.width;
          tmpCanvas.height = captureVideo.videoHeight || displaySize.height;
          const tmpCtx = tmpCanvas.getContext('2d');
          if (tmpCtx) {
            tmpCtx.scale(-1, 1);
            tmpCtx.translate(-tmpCanvas.width, 0);
            tmpCtx.drawImage(captureVideo, 0, 0, tmpCanvas.width, tmpCanvas.height);
            const dataUrl = tmpCanvas.toDataURL('image/jpeg');
            setCapturedPhoto(dataUrl);
          }

          setScanState("COMPLETED");
          stopCameraStream();
        } else {
          setScanAligned(false);
          setStatusText("Arahkan wajah ke tengah oval sesuai petunjuk.");
        }
      } else {
        setScanAligned(false);
        setStatusText("Wajah tidak terdeteksi. Posisikan wajah di depan kamera.");
      }
    }, 150);
  };

  const handleRetake = () => {
    setScanState("SCANNING");
    setScanAligned(false);
    setStatusText("Posisi wajah di tengah kotak. Tahan...");
    setCapturedPhoto(null);
    captureLockRef.current = false;

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    clearScanInterval();
    removeExistingCanvas();
    handleVideoPlaying();
  };

  React.useEffect(() => {
    return () => {
      clearScanInterval();
      stopCameraStream();
    };
  }, []);

  const handleContinue = () => {
    if (!capturedPhoto || scanState !== "COMPLETED") {
      return;
    }

    onScanComplete(capturedPhoto);
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
            <p className={`text-xs mt-2 ${scanAligned ? 'text-emerald-600' : 'text-slate-400'}`}>
              {scanAligned ? 'Posisi wajah sudah sesuai petunjuk.' : 'Ikuti petunjuk scan Face ID yang tertera di samping.'}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Threshold deteksi: {FACE_DETECTION_THRESHOLD}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="relative mx-auto rounded-2xl overflow-hidden border-4 border-slate-200 bg-black w-full min-h-[480px]" ref={canvasContainerRef}>
              <video 
                ref={videoRef} 
                onPlaying={handleVideoPlaying} 
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[72%] h-[86%] rounded-[50%] border-4 border-teal-400/90 shadow-[0_0_0_12px_rgba(15,23,42,0.35)]" />
                </div>
              </div>

              {scanState === "COMPLETED" && (
                <div className="absolute inset-0 bg-teal-500/20 border-4 border-teal-500 flex items-center justify-center">
                  <span className="bg-teal-500 text-white font-bold px-6 py-2 rounded-full text-lg shadow-lg">
                    SCAN BERHASIL
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Petunjuk Scan Face ID</h3>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  Ikuti aturan ini agar proses pemindaian wajah berjalan lancar.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-3">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Jarak</p>
                      <p className="text-sm text-slate-500">Pastikan wajah berjarak 25-50 cm.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Posisi</p>
                      <p className="text-sm text-slate-500">Sejajarkan mata dengan kamera.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Cahaya</p>
                      <p className="text-sm text-slate-500">Cari area dengan pencahayaan cukup.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Aksesoris</p>
                      <p className="text-sm text-slate-500">Lepaskan masker atau kacamata hitam.</p>
                    </div>
                  </div>
                </div>
              </div>

              {onManual && (
                <button
                  onClick={onManual}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:bg-teal-50"
                >
                  Masuk Manual
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-100 sm:flex-row sm:justify-between sm:items-center">
             <button onClick={handleRetake} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 justify-center">
                <RotateCcw className="w-4 h-4" /> Ulangi
             </button>

             <button 
                onClick={handleContinue}
               disabled={scanState !== "COMPLETED" || !capturedPhoto}
               className={`px-8 py-3 font-bold rounded-xl flex items-center gap-2 justify-center transition ${scanState === "COMPLETED" && capturedPhoto ? "bg-[#1B1B1B] text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
             >
                <Save className="w-4 h-4" /> Simpan & Lanjutkan
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
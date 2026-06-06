# SIMRS-FaceID
Modul Registrasi Pasien SIMRSUD Berbasis Biometrik Face ID - Tugas Besar Kelompok 4 RPL.

## Deskripsi
SIMRS-FaceID adalah sistem registrasi pasien untuk SIMRSUD yang memanfaatkan teknologi pengenalan wajah (biometrik Face ID). Proyek ini terdiri dari dua aplikasi frontend:
- `admin-app`: panel admin untuk mengelola data pasien, melihat statistik, dan memantau kunjungan.
- `kiosk-app`: antarmuka kiosk untuk registrasi pasien dan verifikasi wajah.

## Struktur Proyek
- `backend/`: server backend utama.
- `database/`: file skema dan konfigurasi basis data.
- `frontend/admin-app/`: aplikasi admin berbasis React + Vite.
- `frontend/kiosk-app/`: aplikasi kiosk untuk pendaftaran dan pemindaian wajah.

## Cara Menjalankan
1. Pastikan Node.js sudah terpasang.
2. Buka terminal untuk `admin-app`:
   - `cd frontend/admin-app`
   - `npm install`
   - `npm run dev`
   - buka `http://localhost:3001/`
3. Buka terminal untuk `kiosk-app`:
   - `cd frontend/kiosk-app`
   - `npm install`
   - `npm run dev`
   - buka `http://localhost:3000/`

## Fitur Utama
- Registrasi pasien dengan verifikasi wajah.
- Tampilan dashboard admin untuk monitoring.
- Pencatatan kunjungan harian pasien.
- Form identitas pasien dan review registrasi.

## Catatan
- Pastikan `frontend/kiosk-app/public/models` berisi model Face API yang diperlukan.
- Jika menggunakan database lokal, sesuaikan konfigurasi di `backend/` dan `database/schema.sql`.

## Git
Gunakan perintah git umum untuk versi kontrol:
```bash
git status
git add .
git commit -m "pesan commit"
git push origin main
git checkout -b fitur/nama-fitur
git pull origin main
```
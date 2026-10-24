# ifs24018-pabwe2026-proyek1 — Frontend

Frontend Study Planner (React + Vite). Frontend dan backend dipisah.

## Jalankan lokal

```bash
bun install
# jika API berjalan di domain lain, atur VITE_API_BASE pada .env.production
bun run dev
```

## Build produksi

```bash
bun run build
```

Hasil build ada di `dist/`.

## Deploy Vercel + Railway

Backend harus dijalankan sebagai service terpisah karena Vercel tidak mempertahankan file SQLite lokal di antara pemanggilan function.

1. Buat project Railway dari repository ini dan set **Root Directory** ke `backend/ifs24018-pabwe2026-proyek1`. Railway akan memakai `Dockerfile` backend.
2. Tambahkan Railway Volume dengan **mount path** `/data`, lalu set variable backend `DB_FILE=/data/planner.db`. Deploy dan tunggu health check `/api/health` berhasil.
3. Deploy frontend ke Vercel dengan **Root Directory** `frontend/ifs24018-pabwe2026-proyek1`, preset **Vite**, build command `npm run build`, dan output directory `dist`.
4. Pada Vercel Project Settings → Environment Variables, tambahkan `BACKEND_API_URL` dengan URL origin Railway, misalnya `https://study-planner-api.up.railway.app` (tanpa `/api` di akhir).
5. Redeploy frontend setelah menambahkan variable. API proxy Vercel meneruskan `/api/*` ke backend Railway sehingga login tetap memakai origin Vercel dan tidak perlu konfigurasi CORS.

Pastikan backend Railway sudah aktif sebelum mencoba login. Pendaftaran dan login harus menggunakan database yang sama pada volume `/data`.

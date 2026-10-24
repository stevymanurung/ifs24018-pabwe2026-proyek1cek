# ifs24018-pabwe2026-proyek1 — Backend

REST API Study Planner menggunakan Express.js dan SQLite. Backend mendukung Node.js 22.9 atau yang lebih baru dengan `better-sqlite3`, maupun Bun dengan SQLite bawaan Bun.

## Install dan jalankan

```bash
bun install
cp .env.example .env
node --env-file-if-exists=.env src/index.js
```

Default port `3001`; database `./data/planner.db`. Pastikan folder untuk database dapat ditulisi. Atur `CORS_ORIGIN` jika frontend dipasang pada domain berbeda.

## Perintah lain

```bash
node --env-file-if-exists=.env --watch src/index.js
node --env-file-if-exists=.env src/db/seed.js
node --test
```

Frontend dapat dijalankan dengan Bun. Koneksi database memilih driver yang sesuai dengan runtime backend secara otomatis.

## Deploy backend untuk Vercel

Backend harus berjalan pada service terpisah; Vercel hanya menjadi frontend dan proxy API. Contoh konfigurasi yang digunakan proyek ini:

1. Buat service Railway dari repository dan atur **Root Directory** ke `backend/ifs24018-pabwe2026-proyek1`. Service memakai `Dockerfile` di folder ini.
2. Tambahkan Railway Volume dengan **mount path** `/data`, lalu set variable `DB_FILE=/data/planner.db`.
3. Deploy service dan pastikan `https://<domain-backend>/api/health` mengembalikan `{"status":"ok"}`.
4. Pada Vercel, atur **Root Directory** ke `frontend/ifs24018-pabwe2026-proyek1`. Tambahkan environment variable `BACKEND_API_URL` berisi origin backend Railway, misalnya `https://study-planner-api.up.railway.app` tanpa `/api`.
5. Redeploy Vercel setelah mengatur variable. Request `/api/*` dari browser akan diproxy ke backend.

Database SQLite harus berada pada persistent volume agar akun yang didaftarkan tetap tersedia setelah service backend restart.

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

# ifs24018-pabwe2026-proyek1

Study Planner full-stack project. Frontend and backend stay in one repository/ZIP but in separate folders.

## Requirements
- Bun 1.1 or newer

## Install dependencies
Run from this project root:

```powershell
bun install
bun --cwd frontend/ifs24018-pabwe2026-proyek1 install
bun --cwd backend/ifs24018-pabwe2026-proyek1 install
```

## Run the full app
Run from this project root:

```powershell
bun run dev
```

The frontend is at http://localhost:5173 and the API is at http://localhost:3001.
The Vite development server proxies `/api` requests to the backend.

## Run separately
Frontend terminal:

```powershell
bun --cwd frontend/ifs24018-pabwe2026-proyek1 run dev
```

Backend terminal:

```powershell
bun --cwd backend/ifs24018-pabwe2026-proyek1 run dev
```

## Production frontend build

```powershell
bun run build
```

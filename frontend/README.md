# Frontend Setup Guide

## Tech Stack

- **Next.js** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Axios** — HTTP client

---

## Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm or yarn

---

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/saadasif04/multi-tenant-crm.git
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Run Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3001` (or `http://localhost:3000` depending on port availability).

---

## Production Build

Build the app:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

---

## Features

- Authentication
- Dashboard
- API Integration
- Responsive UI

---

## Folder Structure

```
app/
├── dashboard/
├── login/
├── components/
├── hooks/
├── services/
└── layout.tsx
```

---

## Common Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run linter |
| `npm run type-check` | Run TypeScript type check |

---

## Important Notes

> ⚠️ Ensure the backend server is running before starting the frontend.

- Update `NEXT_PUBLIC_API_URL` if the backend URL changes
- Do **NOT** commit `.env.local` to version control
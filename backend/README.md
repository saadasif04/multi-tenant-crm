# Multi-Tenant CRM — Backend

A NestJS backend for a multi-tenant CRM system, powered by Prisma ORM and PostgreSQL (NeonDB), with JWT-based authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| ORM | Prisma |
| Database | PostgreSQL (NeonDB) |
| Auth | JWT |

---

## Prerequisites

Ensure the following are installed before proceeding:

- **Node.js** v18 or higher
- **npm** or **yarn**
- A **PostgreSQL** database (NeonDB recommended)

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/saadasif04/multi-tenant-crm.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require&pgbouncer=true
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

## Database Setup

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Run Migrations

For **production**:

```bash
npx prisma migrate deploy
```

For **development**:

```bash
npx prisma migrate dev
```

## Running the App

### Development

```bash
npm run start:dev
```

Server will be available at: `http://localhost:4000`

## Folder Structure

```
src/
├── auth/         # Authentication logic (JWT, guards, strategies)
├── users/        # User module (CRUD, tenant-scoped)
├── prisma/       # Prisma service and client
├── common/       # Shared utilities, decorators, filters
└── main.ts       # App entry point
```

---

## Common Commands

| Command | Description |
|---|---|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Compile for production |
| `npm run start:prod` | Run production build |
| `npm run seed` | Seed the database with initial data |
| `npx prisma studio` | Open Prisma visual database browser |
| `npx prisma migrate reset` | Reset and re-run all migrations |
| `npx prisma generate` | Regenerate Prisma client after schema changes |

---
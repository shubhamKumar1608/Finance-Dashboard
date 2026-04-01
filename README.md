# Finance Dashboard

A robust, full-stack Finance Dashboard application using Node.js, Express, TypeScript, Prisma (SQLite), and a premium natively-styled React Vite frontend.

## Features

- **Authentication & RBAC**: JWT-based login with Admin, Analyst, and Viewer roles defining API access limits.
- **Financial Records Management**: Add, view, and delete financial records categorized securely.
- **Analytics Dashboard**: Real-time aggregated summaries including total income, total expenses, and net balance.
- **Premium Glassmorphic UI**: Custom Vanilla CSS framework enforcing dark-mode, blur filters, dynamic hover animations, and gradients natively.
- **Type Safety**: Strictly enforced validation via `Zod` and `TypeScript`.

## Tech Stack

| Environment      | Technologies                               |
|------------------|--------------------------------------------|
| **Backend**      | Node.js, Express, TypeScript, Zod, Jest    |
| **Database**     | SQLite, Prisma v5 ORM                      |
| **Frontend**     | Vite, React, React Router                  |

## Getting Started

### 1. Backend Setup

From the project root:

```bash
# Install backend dependencies
npm install

# Initialize local SQLite DB and sync Prisma client types
npx prisma db push
npx prisma generate

# Run the backend Express server (Defaults to Port 3000)
npx ts-node src/server.ts 
# Or `npm run dev` if configured
```

### 2. Frontend Setup

Open a **new** terminal tab and navigate into the nested `frontend` folder:

```bash
cd frontend

# Install UI dependencies
npm install

# Start the Vite React server (Defaults to Port 5173)
npm run dev
```

## Running Tests

Integration tests for backend routing, authentication, and Access Control boundaries are mapped extensively in Jest via Supertest. To execute the suite:
```bash
npm test
```

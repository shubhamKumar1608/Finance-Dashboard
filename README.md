# Finance Dashboard 🚀

A professional, full-stack Finance Dashboard application built with **Node.js, Express, TypeScript, Prisma (PostgreSQL)**, and a premium **Glassmorphic React frontend**.

## ✨ Features
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN`, `ANALYST`, and `VIEWER`.
- **Comprehensive Analytics**: Trends, category-wise spending, calculations (Net Balance), and activity feeds.
- **Dynamic User Management**: Admin portal to manage roles and activate/deactivate accounts.
- **Glassmorphic UI**: High-fidelity custom Vanilla CSS design with blur effects, gradients, and micro-animations.
- **Integrated Security**: HTTP-only JWTs, Helmet.js for CSP, and Bcrypt hashing.

## 🛠️ Tech Stack
| Tier | Technology |
|---|---|
| **Backend** | Node.js, Express 5, TypeScript, Zod, JWT |
| **Database** | PostgreSQL, Prisma ORM |
| **Frontend** | React 18, Vite, Lucide icons, Vanilla CSS |
| **Testing** | Jest, Supertest |
| **Deployment** | Render (Infrastructure as Code via `render.yaml`) |

---

## 🧠 Technical Decisions and Trade-offs

### 1. **The Choice of "Glassmorphism" over TailwindCSS**
**Decision**: I opted for a custom Vanilla CSS system rather than utility frameworks like Tailwind or component libraries like MUI.
- **Pros**: Zero runtime overhead, 100% design flexibility, and a truly unique, premium "Apple-like" aesthetic that feels bespoke rather than "out-of-the-box."
- **Cons**: Development time per component is higher.
- **Trade-off**: High visual quality and performance were prioritized over development speed.

### 2. **Express 5 & Path-to-Regexp**
**Decision**: I used the newest **Express v5** beta for native `async/await` error handling.
- **Challenge**: Express 5 removed string-based wildcard patterns (e.g., `*`).
- **Fix**: I implemented native Regex objects `/(.*)/` for the SPA catch-all route.
- **Trade-off**: Used an experimental branch of Express to gain cleaner error-handling code at the cost of slightly more strict routing syntax.

### 3. **Consolidated Analytical API vs. Multiple Micro-Fetches**
**Decision**: Created a `getFullSummary` endpoint to fetch all dashboard data in one request.
- **Pros**: Drastically reduces network latency and waterfall effects in the frontend.
- **Cons**: Slightly higher database load per request.
- **Trade-off**: Better UX and "snappy" dashboard loading was preferred over ultra-granular API partitioning.

### 4. **Prisma & No-Enum Trade-off (Postgres Migration)**
**Decision**: We originally used SQLite for local prototyping. When moving to PostgreSQL, I maintained string-based status and roles instead of native DB enums.
- **Pros**: Keeps the schema compatible across different DB types and makes migrations between Postgres providers easier.
- **Cons**: Relies on application-level (Zod/TS) validation rather than database-level constraints.
- **Trade-off**: Portability and flexibility won over strict DB-native validation.

### 5. **Workspaces & Monorepo Structure**
**Decision**: Implemented `npm workspaces` late in the deployment.
- **Pros**: Cut Render build times by ~40% by sharing the dependency tree and parallelizing installs.
- **Cons**: Initial complexity in pathing for the TypeScript compiler (fixed by isolated `tsconfig.json`).
- **Trade-off**: Added slightly more configuration overhead to achieve significantly faster CI/CD cycles.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
npm install
npm run db:push
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing
```bash
npm test
```

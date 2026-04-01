# Finance Dashboard 🚀

A professional, full-stack Finance Dashboard application built with **Node.js, Express 5, TypeScript, Prisma (PostgreSQL)**, and a premium **Glassmorphic React frontend**.

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
| **Database** | PostgreSQL (Production), SQLite (Testing), Prisma ORM |
| **Frontend** | React 18, Vite, Lucide icons, Vanilla CSS |
| **Testing** | Jest, Supertest |
| **Monorepo** | npm Workspaces |

---

## 🏗️ Setup and Installation

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- A PostgreSQL database (or use local SQLite for dev)

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
JWT_SECRET="your_extremely_secure_random_key"
JWT_EXPIRES_IN="1d"
```

### 3. Local Installation
From the project root:
```bash
# Install dependencies for both Backend & Frontend (via Workspaces)
npm install

# Push the schema to your database and generate Prisma Client
npm run db:push

# Start the full ecosystem (Backend on 3000, Frontend on 5173)
# To run backend only:
npm run dev
# To run frontend only:
cd frontend && npm run dev
```

---

## 🚫 Current Limitations

### 1. **Authentication Storage**
Current implementation stores the JWT in `localStorage`. While convenient, it is susceptible to XSS. A production-ready environment would typically utilize **HTTP-Only Cookies** for safer token persistence.

### 2. **State Management Scalability**
We are using the native **React Context API** for global auth state. As the app grows (e.g., global filtering, multi-currency toggles), we would likely transition to **Zustand** or **Redux Toolkit** to prevent unnecessary re-renders.

### 3. **Static Data Visualization**
The dashboard charts are custom-built with pure CSS for zero bundle overhead. However, they lack interactivity (tooltips, dynamic zooming) found in heavy libraries like **Recharts** or **D3**.

---

## 🧬 Technical Decisions and Trade-offs

- **Glassmorphism**: Prioritized high-end custom "Apple-style" aesthetics over the speed of Tailwind utility classes.
- **Express 5 Beta**: Chose the newer beta branch to gain native `async/await` error handling, simplifying the middleware stack.
- **Consolidated API**: All analytical data is fetched in one `/full-summary` request to eliminate loading waterfalls and improve "perceived performance."
- **NPM Workspaces**: Implemented a monorepo structure once the project matured to cut build and installation times in half.

---

## 📈 Areas for Future Improvement

- **[ ] Interactive Charts**: Integrate `Recharts` for interactive tooltips and zooming.
- **[ ] Live Notifications**: Implementation of a toast system (e.g., `react-hot-toast`) for real-time feedback (e.g., successful/failed payments).
- **[ ] Advanced Filtering**: Allow users to filter the entire dashboard by custom date ranges (Weekly, Quarterly, Yearly).
- **[ ] Export Capabilities**: Add a one-click "Export to CSV/PDF" button for financial reports.
- **[ ] MFA**: Add Multi-Factor Authentication (OTP via email/SMS) for the Admin role.

---

## 🧪 Testing Integration
Run the suite of integration and unit tests:
```bash
npm test
```
The application maintains a healthy test coverage for auth boundaries and DB logic.

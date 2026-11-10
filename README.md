# IGNITE - Technical Innovation Club

Official website and backend services for **IGNITE - The Technical Innovation Club** at BIT Mesra.

---

## 📁 Repository Architecture

The repository is organized into a clean **frontend** and **backend** architecture:

```
Ignite/
├── frontend/                   # Client-side Next.js 16 (App Router) Application
│   ├── app/                    # Next.js App Router pages (/team, /events, /gallery, etc.)
│   ├── components/             # Reusable React UI components
│   ├── lib/                    # Client-side API client (api.ts) & navigation adapters
│   ├── public/                 # Static public assets (WebP images, logos, icons)
│   ├── data.ts                 # Club roster, executive board, and static data
│   ├── types.ts                # TypeScript interface definitions
│   ├── index.css               # Tailwind CSS v4 styling & themes
│   ├── next.config.mjs         # Next.js config with API proxy rewrites to backend
│   ├── package.json            # Frontend-specific dependencies (React 19, Framer Motion, etc.)
│   └── tsconfig.json           # Frontend TypeScript configuration
│
├── backend/                    # Node.js + Express + MongoDB REST API Server
│   ├── routes/                 # Express API route handlers (auth, events, exam, recruit, etc.)
│   ├── models/                 # Mongoose database schemas & models
│   ├── middleware/             # Authentication & validation middleware
│   ├── lib/                    # Server utilities (Groq AI, Mailer, Scheduler)
│   ├── uploads/                # User uploaded assets, photos & certificate templates
│   ├── scripts/                # Database maintenance & image conversion utilities
│   ├── app.js                  # Express application setup, CORS & route mounting
│   ├── index.js                # Standalone HTTP server entrypoint (Port 5000)
│   ├── db.js                   # MongoDB connection logic
│   ├── sample_questions.csv    # Sample exam questions data
│   └── package.json            # Backend-specific dependencies (Express, Mongoose, etc.)
│
├── package.json                # Root monorepo workspace orchestrator
├── start_app.bat               # Windows batch script to launch both services
└── README.md
```

---

## 🚀 Quick Start

### 1. Run via root workspace scripts

- **Start Frontend (Port 3000)**:
  ```bash
  npm run dev
  ```
- **Start Backend (Port 5000)**:
  ```bash
  npm run server:dev    # with auto-restart
  # or
  npm run server        # production mode
  ```
- **Build Frontend for Production**:
  ```bash
  npm run build
  ```

### 2. Run services independently

- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend**:
  ```bash
  cd backend
  npm run dev
  ```

### 3. Windows 1-Click Launch
Double-click `start_app.bat` to launch both frontend and backend in separate terminal windows.

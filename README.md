# Zigmaa CRM Frontend

React frontend using TypeScript, Vite, and Tailwind CSS.

## Setup

Requires Node.js 20.19 or newer.

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:5173`.

The login page uses local shadcn/ui components and supports email/password JWT
authentication plus Google Identity Services. Set `VITE_GOOGLE_CLIENT_ID` in
`.env.local` to enable the Google button.

The React entry point is `src/main.tsx`, the root component is `src/App.tsx`,
shared utilities live in `src/lib`, and static assets belong in `public`.

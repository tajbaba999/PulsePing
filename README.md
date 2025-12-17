<p align="center">
  <img src="https://img.shields.io/badge/PulsePing-Uptime%20Monitoring-667eea?style=for-the-badge&logo=activity&logoColor=white" alt="PulsePing"/>
</p>

<h1 align="center">⚡ PulsePing</h1>

<p align="center">
  <strong>Modern uptime monitoring and incident management platform</strong>
</p>

<p align="center">
  <a href="https://v0-pulse-ping-frontend-ui.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit-brightgreen?style=flat-square" alt="Live Demo"/>
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma" alt="Prisma"/>
</p>

---

## 🎯 Overview

**PulsePing** is a real-time uptime monitoring solution that helps you track the health of your services, APIs, and websites. Get instant alerts when something goes wrong and create comprehensive postmortem reports to prevent future incidents.

## ✨ Features

- **🔍 Monitor Management** — Track HTTP/HTTPS endpoints with configurable frequencies and auth support
- **📊 Real-time Dashboard** — Live uptime stats, response time charts, and status indicators
- **🚨 Smart Alerting** — Email notifications via Resend on downtime detection
- **📁 Project Organization** — Group monitors into projects for easy management
- **📝 Incident Postmortems** — Document incidents with timelines and root cause analysis
- **🔐 Secure Auth** — Authentication powered by Clerk

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| **ORM** | [Prisma 7](https://www.prisma.io/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Email** | [Resend](https://resend.com/) |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/tajbaba999/PulsePing.git
cd PulsePing

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
npx prisma db push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Resend
RESEND_API_KEY="re_..."
```

## 📂 Project Structure

```
├── app/
│   ├── api/           # API routes (monitors, projects, alerts, webhooks)
│   ├── dashboard/     # Protected dashboard pages
│   ├── login/         # Auth pages
│   └── register/
├── components/
│   ├── dashboard/     # Dashboard components
│   ├── landing/       # Landing page components
│   └── ui/            # Reusable UI (shadcn)
├── lib/               # Utilities & Prisma client
└── prisma/            # Database schema
```

## 🗄️ Database Schema

- **User** — Clerk-backed accounts
- **Project** — Monitor groupings
- **Monitor** — Endpoint configurations
- **MonitorRun** — Health check results
- **Alert** — Notification records
- **Postmortem** — Incident documentation

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/tajbaba999">tajbaba999</a>
</p>
# Dentalcarehk

Hong Kong Dental Appointment & Online Consultation Platform (frontend MVP).

This repository contains a multi-portal web application with:
- User app flows (booking, consultation, profile, orders)
- Institution portal
- Doctor portal
- Platform Administration System

The current implementation is **frontend-only** and uses **mock data**.  
Where external integrations are required, the UI explicitly shows: **"API key not added yet"**.

---

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS + shadcn/ui (Radix-based components)
- TanStack Query (provider ready)
- Recharts (admin analytics)
- Vitest + Testing Library
- ESLint

---

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Run locally

```bash
npm run dev
```

### 3) Build

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

### 5) Lint and tests

```bash
npm run lint
npm run test
```

---

## Project Structure

```text
src/
  admin/         Platform Admin System
  doctor/        Doctor portal
  institution/   Institution portal
  pages/         User-side pages
  components/    Shared components + ui primitives
  context/       User-side context state
  i18n/          Language context and translations
  data/          Global mock domain data
```

---

## Platform Admin System (Current Scope)

Key admin modules:
- Dashboard
- Institutions
- Doctors
- Users
- Orders
- Disputes
- Marketing (Coupons, Campaigns, Banners)
- Financials (Transactions, Settlements, Withdrawals)
- System Settings

Recent improvements include:
- Unified admin navigation architecture
- Reusable status badges and notifications
- Cross-module linking (orders/disputes/users/doctors/institutions)
- Better mock data relationship consistency
- Bilingual UI consistency (English + Traditional Chinese)

---

## System Settings (Admin)

Implemented settings modules:
- Basic Settings
  - Platform name
  - Logo placeholder upload
  - Service fee rate
  - Appointment cancellation + penalty settings
  - Online consultation rules (message count, time window, video duration)
- Language Settings (EN / 繁中 editable copy table)
- Permission Management (role-based permission matrix)
- Admin Account Management (create/edit/enable/disable)
- Log Management (operation and login logs with filters)

Basic settings are persisted in browser storage to simulate cross-module influence (mock behavior).

---

## Internationalization

- Supported languages: **English** and **Traditional Chinese (zh-HK)**
- Language is managed by `LanguageContext`
- Selection is persisted in localStorage

---

## Mock-Only Behavior

- No real backend APIs are integrated yet
- No real file upload, payment, export, SMS, or banking integrations
- API-dependent UI actions display "API key not added yet"

---

## Notes for Developers

- This project may contain uncommitted local changes during active development.
- Prefer extending existing modules/components over rewriting pages.
- Keep desktop admin dashboard UI clean and presentation-ready.
- Preserve bilingual consistency for any new visible text.

---

## License

Internal / private project (no public license specified).

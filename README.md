# EVENTORA – Professional Event & Ticket Booking Platform

![Eventora Platform](https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80)

**EVENTORA** is a full-stack, enterprise-grade event discovery, ticket booking, and entrance management platform. Built with a modern dark-navy aesthetic inspired by Ticketmaster, Eventbrite, and modern SaaS dashboards, it features tamper-proof digital QR tickets, camera-based gate check-ins, multi-tier pricing, role-based access control, and flexible payment gateway integrations (Telebirr, Chapa, Stripe, and Test mode).

---

## 🌟 Key Features

### 1. Public Discovery & Booking
- **Global Event Search & Dynamic Filtering**: Instant search across keywords, categories (Music & Concerts, Technology, Business, Education, Sports, Festivals, Entertainment, Workshops), venues, dates (Today, Tomorrow, Weekend, Month), and pricing (Free vs. Paid).
- **Interactive Event Showcase**: High-res image galleries, interactive venue location details, organizer bios with verified badges, and attendee review ratings.
- **Ticket Tier Matrix**: Support for multiple tiers per event (*Early Bird, Regular, VIP Front Row, Student, Free Pass*) with real-time remaining inventory tracking and perks breakdowns.
- **Atomic Booking Engine**: Concurrency protection preventing overselling, unique booking references (`EVT-XXXXXXXX`), and automated coupon discounts (e.g. `EVENTORA2026`).

### 2. Digital QR Code & Entrance Verification
- **Unique Cryptographic Tokens**: Every single ticket generates a cryptographically unique `qr_token` and serialized ticket number (`TKT-XXXXXXXX-XX`).
- **High-Resolution Printable PDF Tickets**: Built-in PDF engine (`jspdf` + `html2canvas`) generating branded boarding-pass tickets with security badges, barcodes, and QR codes.
- **Camera-Based Gate Scanner**: Organizers and admins can scan tickets directly using their smartphone, tablet, or webcam (`html5-qrcode`).
- **Duplicate Check-In Guard**: Server-validated check-in audit records prevent duplicate or counterfeit entries (`ALREADY_USED`, `VALID`, `INVALID`, `UNAUTHORIZED`).

### 3. Comprehensive Role-Based Dashboards
- **Customer Dashboard**:
  - View all active e-tickets with printable view and QR code modal.
  - Track upcoming vs. past events.
  - Saved event favorites list.
  - Payment and transaction invoice history.
  - Personal profile and contact information settings.
- **Organizer Dashboard**:
  - Event Creation Wizard (4 steps: Basic Details, Venue/Date, Ticket Tiers, Media/Terms).
  - Manage live vs. draft events.
  - Real-time revenue analytics with Recharts (Gross sales in ETB, tickets sold, attendance velocity).
  - Attendee roster management with real-time check-in telemetry.
  - One-click CSV Attendee Roster export.
  - Integrated QR scanner launcher.
- **Executive Administrator Portal**:
  - Platform KPIs (Gross sales, platform fee commission, registered users, approval queue).
  - Event Moderation: Approve or Reject submissions with custom feedback.
  - User Management: Inspect customers and organizers; suspend/activate accounts.
  - Payment Ledger: Unified view of all transactions and transaction references.
  - System Settings: Configure platform fee percentage, default currency, and SMS gateway.

### 4. Robust Dual-Mode Architecture
- **Supabase Cloud Ready**: Connects automatically when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided in `.env`.
- **Resilient Local Persistence & Demo Persona Mode**: When running locally without cloud credentials, Eventora automatically activates its reactive storage engine with realistic seed data, real 6-digit OTP verification, and instant persona switching between **Customer**, **Organizer**, and **Admin**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling & UI** | Tailwind CSS + Lucide React + Glassmorphism |
| **Backend & Database** | Supabase (PostgreSQL 15 + Row Level Security + RPCs) |
| **Authentication** | Supabase Auth (Email OTP, Session Persistence, RBAC) |
| **QR Code & Scanning** | `qrcode.react` (SVG Generation) + `html5-qrcode` (Camera Scanner) |
| **PDF Generation** | `jspdf` + `html2canvas` |
| **Data Visualization** | `recharts` |
| **Routing** | `react-router-dom` |
| **Deployment** | Vercel SPA Configured (`vercel.json`) |

---

## 📁 Project Structure

```
├── .env.example                     # Sample environment variable template
├── index.html                       # HTML entry point with Google Fonts
├── package.json                     # Dependencies and build scripts
├── server.js                        # Node.js production preview server
├── tailwind.config.js               # Eventora design system & colors
├── tsconfig.json                    # TypeScript compiler configuration
├── vercel.json                      # Vercel SPA rewrite rules
├── vite.config.ts                   # Vite bundler configuration & aliases
├── supabase/
│   ├── migrations/
│   │   └── 20261110000000_eventora_schema.sql  # Complete PostgreSQL schema & RLS policies
│   └── seed.sql                     # Seed categories & initial platform settings
└── src/
    ├── types/                       # TypeScript interfaces (Event, Ticket, Booking, etc.)
    ├── lib/
    │   ├── supabase.ts              # Supabase client initialization & fallback check
    │   ├── utils.ts                 # Formatting, currency (ETB/USD), QR tokens
    │   ├── mockData.ts              # Rich seed dataset (events, organizers, attendees)
    │   └── storage.ts               # Reactive localStorage synchronization engine
    ├── services/
    │   ├── authService.ts           # Auth, Email OTP, session persistence, demo switcher
    │   ├── eventService.ts          # Event queries, filtering, search, and CRUD
    │   ├── bookingService.ts        # Atomic booking engine & inventory decrement
    │   ├── ticketService.ts         # Server-side QR token verification & check-ins
    │   └── adminService.ts          # Moderation, KPI telemetry, and platform settings
    ├── context/
    │   ├── AuthContext.tsx          # User session, persona switching, RBAC
    │   ├── ThemeContext.tsx         # Dark / Light theme toggle
    │   └── ToastContext.tsx         # Toast notification system
    ├── components/
    │   ├── common/                  # Navbar, Footer, Modal, Badge, ProtectedRoute
    │   ├── events/                  # EventCard, EventFilters, ShareModal
    │   └── tickets/                 # TicketCard, QrScannerModal
    └── pages/
        ├── HomePage.tsx             # Hero, search bar, categories, featured, how it works
        ├── EventsPage.tsx           # Full discovery catalog with filters & sorting
        ├── EventDetailsPage.tsx     # Gallery, ticket tier selector, reviews, map info
        ├── CheckoutPage.tsx         # Payment gateway selection (Telebirr, Chapa, Stripe)
        ├── BookingSuccessPage.tsx   # Confetti, printable/downloadable QR tickets
        ├── Auth/                    # LoginPage, RegisterPage, OtpVerificationPage, ForgotPassword
        ├── Dashboard/               # CustomerDashboard, OrganizerDashboard, EventCreateEdit, AdminDashboard
        └── Static/                  # AboutPage, ContactPage, FaqPage, Terms, Privacy, NotFound
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** or **pnpm**

### 1. Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/your-username/eventora-platform.git
cd eventora-platform
npm install
```

### 2. Configuration (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

To run with **Live Supabase**, configure your credentials:

```ini
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_URL=http://localhost:3000
VITE_DEFAULT_CURRENCY=ETB
VITE_TELEBIRR_ENABLED=true
VITE_CHAPA_ENABLED=true
VITE_STRIPE_ENABLED=true
```

> **Note**: If `VITE_SUPABASE_URL` is omitted, the application runs seamlessly in **Local Resilient Mode** with pre-seeded realistic events, bookings, and demo accounts.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Copy and run the entire SQL migration script from:
   `supabase/migrations/20261110000000_eventora_schema.sql`
4. Run the seed data script:
   `supabase/seed.sql`
5. All 15 relational tables, indexes, stored procedures (`process_event_booking`, `verify_and_check_in_ticket`), and Row Level Security (RLS) policies will be configured automatically.

---

## 🔐 Demo Accounts & Instant Role Switching

For testing and grading convenience, Eventora provides pre-configured credentials and an **Instant Persona Switcher** in the top navigation bar:

| Role | Email | Password | Pre-seeded Permissions |
|---|---|---|---|
| **Customer** | `customer@eventora.com` | `Password123!` | Book tickets, view QR passes, download PDFs, view payment history |
| **Organizer** | `organizer@eventora.com` | `Password123!` | Create & edit events, manage ticket tiers, scan QR tickets, export CSV roster |
| **Administrator** | `admin@eventora.com` | `Password123!` | Moderate events, approve/reject submissions, suspend users, configure fees |

---

## 💳 Payment Gateway Configurations

Eventora is designed for Ethiopian and international financial flows:

1. **Telebirr**: Users enter their mobile number or scan the QR code to confirm payment.
2. **Chapa**: Integration layer supporting CBE Birr, Awash Birr, and local debit cards.
3. **Stripe**: International card payments (Visa, Mastercard, Amex) with 3D Secure verification.
4. **Free Tickets**: Instant zero-amount confirmation without unnecessary payment prompts.

---

## 📱 QR Code Gate Check-In Guide

1. Log in with an **Organizer** or **Administrator** account.
2. Click **"Launch QR Scanner"** in the Organizer Dashboard (or navigate to `/dashboard/organizer/check-in`).
3. Allow camera access.
4. Point the camera at any attendee's digital ticket or printed paper pass.
5. The system performs atomic verification:
   - **VALID (Green)**: Check-in approved, timestamp and organizer ID logged in audit ledger.
   - **ALREADY_USED (Amber)**: Warning banner showing the previous check-in time and preventing duplicate entry.
   - **INVALID (Red)**: Fake, revoked, or non-existent ticket token rejected.

---

## ☁️ Deployment

### Deploy to Vercel
Eventora includes a pre-configured `vercel.json` with SPA routing rewrites:

```bash
npx vercel --prod
```

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your Vercel Project Settings under **Environment Variables**.

---

## 📄 License
MIT License. Built for commercial and enterprise ticketing scale.

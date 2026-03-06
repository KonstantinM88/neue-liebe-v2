# Neue Liebe — Restaurant Website

> **Stack:** Next.js 15.2.8 · React 19 · TypeScript 5.9.3 · Tailwind CSS 4 · Prisma 6.19.2 · Node.js 22.14 · PostgreSQL

---

## Quickstart

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

### 3. Database setup
```bash
npm run db:generate   # prisma generate
npm run db:push       # create tables (dev)
# or
npm run db:migrate    # production migrations
```

### 4. Run development server
```bash
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
neue-liebe/
├── app/
│   ├── layout.tsx               # Root layout + Google Fonts
│   ├── page.tsx                 # Main page (all sections)
│   ├── globals.css              # Tailwind v4 + CSS tokens
│   └── api/
│       └── reservations/
│           └── route.ts         # POST & GET /api/reservations
│
├── components/
│   ├── Cursor.tsx               # Custom cursor with RAFloop
│   ├── Loader.tsx               # Intro loader
│   ├── Navigation.tsx           # Sticky nav + lang switcher
│   ├── MobileMenu.tsx           # Full-screen mobile menu
│   ├── ScrollProgress.tsx       # Gold progress bar
│   ├── Toast.tsx                # Notification toast
│   ├── Footer.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── InfoBar.tsx
│       ├── About.tsx
│       ├── Experience.tsx
│       ├── MenuSection.tsx      # With category filters
│       ├── ParallaxQuote.tsx
│       ├── Gallery.tsx          # 12-col masonry grid
│       ├── Events.tsx
│       ├── Reservation.tsx      # Form → POST /api/reservations
│       └── Contact.tsx          # + Google Maps embed
│
├── context/
│   └── LangContext.tsx          # DE/EN language context
│
├── hooks/
│   └── useReveal.ts             # IntersectionObserver hook
│
├── lib/
│   └── prisma.ts                # Singleton PrismaClient
│
└── prisma/
    └── schema.prisma            # Reservation model
```

---

## API Routes

| Method | Path                | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/reservations` | Create new reservation   |
| GET    | `/api/reservations` | List reservations (admin)|

### POST body
```json
{
  "firstName": "Maria",
  "lastName": "Müller",
  "email": "maria@beispiel.de",
  "phone": "+49 ...",
  "date": "2024-06-15",
  "time": "19:00",
  "guests": 4,
  "occasion": "DINNER",
  "specialRequest": "Fenstertisch bitte",
  "lang": "de"
}
```

### Occasion values
`DINNER` · `BIRTHDAY` · `WEDDING` · `CORPORATE` · `OTHER`

---

## Design Tokens (CSS variables)

| Token              | Value     |
|--------------------|-----------|
| `--color-gold`     | `#c9a96e` |
| `--color-gold-light`| `#e8d5a3`|
| `--color-charcoal` | `#1a1714` |
| `--color-cream`    | `#faf6f0` |
| `--color-brown`    | `#4a3728` |

All tokens are defined in `app/globals.css` under `@theme` (Tailwind v4) **and** as native CSS custom properties for runtime use.

---

## Prisma Commands

```bash
npm run db:generate  # Regenerate client after schema changes
npm run db:migrate   # Create and apply migrations
npm run db:push      # Sync schema to DB (dev only)
npm run db:studio    # Open Prisma Studio
```

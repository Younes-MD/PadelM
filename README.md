# PadelMarket — Used Padel Racket Marketplace

A production-ready web application for buying and selling used padel rackets. Built with Next.js 14, PostgreSQL (Prisma), Cloudinary, and deployed on Vercel.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Vercel (Edge)                  │
│  ┌───────────────────────────────────────────┐   │
│  │            Next.js 14 (App Router)        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────┐  │   │
│  │  │  Pages   │  │   API    │  │ Middle- │  │   │
│  │  │  (SSR)   │  │  Routes  │  │  ware   │  │   │
│  │  └──────────┘  └──────────┘  └────────┘  │   │
│  └───────────────────────────────────────────┘   │
│         │                │                       │
│    ┌────▼────┐     ┌─────▼─────┐                 │
│    │ Prisma  │     │Cloudinary │                  │
│    │  ORM    │     │  (Images) │                  │
│    └────┬────┘     └───────────┘                  │
│         │                                        │
│  ┌──────▼──────┐                                 │
│  │ PostgreSQL  │  (Neon / Supabase — free tier)   │
│  └─────────────┘                                 │
└─────────────────────────────────────────────────┘
```

**Key decisions:**
- **PostgreSQL + Prisma** over MongoDB: relational data (rackets, submissions, contacts) benefits from strong schemas, joins, and indexing. Prisma provides type-safe queries.
- **Cloudinary** for images: free 25GB tier, automatic WebP conversion, responsive transforms.
- **JWT in HttpOnly cookies** for admin auth: more secure than localStorage tokens, CSRF-resistant with SameSite.
- **In-memory rate limiter** for simplicity — upgrade to Upstash Redis for multi-instance production.
- **Zod** for server-side validation: ensures no invalid data reaches the database.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud)
- Cloudinary account (free)

### 1. Clone & Install

```bash
git clone <your-repo>
cd padel-marketplace
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | [Neon](https://neon.tech) free tier or local PostgreSQL |
| `JWT_SECRET` | Run `openssl rand -hex 32` |
| `CLOUDINARY_CLOUD_NAME` | [Cloudinary dashboard](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard |
| `ADMIN_USERNAME` | Your chosen admin username |
| `ADMIN_PASSWORD` | Your chosen admin password |

### 3. Setup Database

```bash
npx prisma db push    # Create tables
npm run db:seed       # Seed admin user + sample rackets
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Deployment to Vercel (Free)

### Step 1: Create Free Services

#### Database — Neon (recommended)
1. Go to [neon.tech](https://neon.tech) → Sign up (free)
2. Create a project → Copy the connection string
3. It looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

#### Images — Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) → Sign up (free: 25GB)
2. Dashboard → Copy Cloud Name, API Key, API Secret

### Step 2: Deploy to Vercel

1. Push your code to GitHub/GitLab
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. In the deployment settings, add these **Environment Variables**:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_CONTACT_PHONE=+34 600 000 000
NEXT_PUBLIC_WHATSAPP=34600000000
```

4. Click **Deploy**

### Step 3: Seed the Production Database

After deployment, run in your local terminal:

```bash
# Set DATABASE_URL to your Neon production URL
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." ADMIN_USERNAME=admin ADMIN_PASSWORD=YourStrongPass npm run db:seed
```

---

## Custom Domain + DNS Configuration

### Option A: Domain from Namecheap/GoDaddy/Google Domains

1. In Vercel dashboard → Your project → **Settings** → **Domains**
2. Add your domain (e.g., `padelmarket.com`)
3. Vercel will show you DNS records to configure:

#### DNS Records to Add

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

4. Go to your domain registrar's DNS settings and add these records
5. Wait 5-30 minutes for propagation
6. Vercel will auto-provision an SSL certificate

### Option B: Subdomain Only

If using a subdomain like `shop.yourdomain.com`:

| Type | Name | Value |
|------|------|-------|
| `CNAME` | `shop` | `cname.vercel-dns.com` |

### Verify DNS Propagation

```bash
# Check A record
dig padelmarket.com A

# Check CNAME
dig www.padelmarket.com CNAME

# Or use https://dnschecker.org
```

After domain is connected, update `NEXT_PUBLIC_SITE_URL` in Vercel env vars.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (header + footer)
│   ├── page.tsx                # Homepage (featured rackets, hero)
│   ├── globals.css             # Tailwind + custom styles
│   ├── rackets/
│   │   ├── page.tsx            # Browse with filters
│   │   └── [id]/page.tsx       # Racket detail page
│   ├── sell/page.tsx           # Submit racket form
│   ├── contact/page.tsx        # Contact form
│   ├── api/
│   │   ├── rackets/route.ts    # Public racket API
│   │   ├── submissions/route.ts # Public submission API
│   │   ├── contact/route.ts    # Public contact API
│   │   ├── upload/route.ts     # Image upload (Cloudinary)
│   │   ├── auth/
│   │   │   ├── login/route.ts  # Admin login
│   │   │   └── logout/route.ts # Admin logout
│   │   ├── analytics/route.ts  # Dashboard stats
│   │   └── admin/
│   │       ├── rackets/route.ts      # Admin CRUD
│   │       └── submissions/route.ts  # Approve/reject
│   └── admin/
│       ├── layout.tsx          # Admin sidebar layout
│       ├── login/page.tsx      # Login page
│       ├── page.tsx            # Dashboard
│       ├── rackets/page.tsx    # Manage listings
│       ├── submissions/page.tsx # Review submissions
│       └── analytics/page.tsx  # Stats & metrics
├── components/
│   ├── Header.tsx              # Site navigation
│   ├── Footer.tsx              # Site footer
│   ├── RacketCard.tsx          # Racket listing card
│   └── ImageUpload.tsx         # Drag-and-drop upload
├── lib/
│   ├── prisma.ts               # Prisma singleton
│   ├── auth.ts                 # JWT auth utilities
│   ├── cloudinary.ts           # Image upload helpers
│   ├── rate-limit.ts           # Rate limiter
│   ├── validators.ts           # Zod schemas + constants
│   └── api-helpers.ts          # Response utilities
└── middleware.ts               # Admin route protection
```

---

## Security

- **Admin auth**: JWT in HttpOnly + SameSite cookies (not localStorage)
- **Middleware**: Protects all `/admin/*` and `/api/admin/*` routes
- **Rate limiting**: Per-IP limits on submissions (3/hr), contacts (5/hr), uploads (20/hr), logins (5/15min)
- **Input validation**: Zod schemas on all API endpoints
- **File validation**: Type + size checks before Cloudinary upload
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- **Password hashing**: bcrypt with 12 rounds

---

## Scaling Recommendations

When traffic grows beyond the free tier:

1. **Database**: Upgrade Neon plan or migrate to Supabase/PlanetScale
2. **Rate limiting**: Replace in-memory with [Upstash Redis](https://upstash.com) (free tier available)
3. **Image CDN**: Cloudinary auto-scales; consider their paid plans for bandwidth
4. **Search**: Add full-text search with PostgreSQL `tsvector` or Algolia
5. **Email notifications**: Add Resend or SendGrid for submission/contact alerts
6. **Analytics**: Integrate Plausible or PostHog for privacy-friendly visitor analytics
7. **Caching**: Add Redis caching layer for hot queries

---

## License

MIT

# ResearchEdge — Research & Academic Services Platform

A complete, modern, production-ready MERN Stack platform for a premium research consultancy and academic support company.

Built for: Students, Researchers, PhD Scholars, Faculty Members, Colleges, Schools, and Educational Institutions.

---

## Table of Contents

1. Project Overview
2. Features
3. Tech Stack
4. Folder Structure
5. Installation & Setup
6. Environment Variables
7. MongoDB Setup
8. Admin Setup
9. Design System
10. SEO Implementation
11. Security
12. API Reference
13. Development Commands
14. Production Build
15. Deployment
16. Ethical Guidelines
17. License

---

## 1. Project Overview

ResearchEdge is a full-stack MERN application that powers a professional research and academic support services website. It combines a premium public-facing marketing site with a secure admin dashboard for managing all content dynamically from MongoDB.

The platform serves as a commercial-grade research consultancy portal offering:

- Research support and academic writing guidance
- Dissertation, thesis, and synopsis assistance
- Research paper writing and publication assistance
- Data collection and statistical analysis support
- Faculty Development Program (FDP) documentation
- Research proposal writing guidance
- College and school academic documentation

The website is fully responsive, SEO-optimized, and designed to feel like a premium academic consultancy — not a basic demo template.

Important: This platform provides expert academic guidance and structured support only. It does NOT guarantee publication, acceptance, marks, admission, PhD completion, or any specific academic outcome. All wording follows ethical academic support language.

---

## 2. Features

### Public Website

- Fully responsive mobile-first design
- Sticky navbar with mobile hamburger menu
- Premium hero section with animated research cards
- Configurable statistics (research projects, papers, scholars, institutions)
- Dynamic service cards loaded from MongoDB
- Individual service detail pages with:
  - Short and detailed descriptions
  - Key features
  - Benefits
  - Process steps
  - Target audience
  - Service-specific FAQs
  - Call-to-action and enquiry button
- Why Choose Us section with trust factors
- Six-step research support process visualization
- Audience / industries section (students, scholars, faculty, colleges, etc.)
- Testimonials with star ratings
- FAQ accordion (configurable)
- Contact page with validated enquiry form
- WhatsApp, phone, email and map integration
- Legal pages: Privacy Policy, Terms & Conditions, Refund Policy, Disclaimer
- Loading, empty, and error states throughout
- Smooth subtle animations with Framer Motion

### Admin Panel

- JWT-based authentication with bcrypt password hashing
- Protected routes with authentication middleware
- Responsive sidebar with grouped navigation
- Dashboard with live statistics cards
- Recent enquiries table
- Full CRUD for Services (title, slug, descriptions, features, benefits, process, audience, FAQs, icon, CTA, order, status)
- Full CRUD for Testimonials (name, designation, institution, review, rating, order, status)
- Full CRUD for FAQs (question, answer, order, status)
- Full CRUD for Statistics (title, value, icon, order, status)
- Enquiry management with status workflow (New, Contacted, In Progress, Completed, Closed)
- Search and filter for enquiries
- Contact message management (unread, read, replied)
- Site Settings management (company info, contact details, social links, footer text, SEO defaults)
- Admin Profile page with change password
- Toast notifications for all actions
- Confirmation modals before destructive actions
- Pagination-ready responsive tables

---

## 3. Tech Stack

### Frontend

- React.js (v18)
- Vite (build tool)
- React Router DOM v6 (routing)
- Axios (HTTP client)
- Context API (Auth and Toast state)
- Framer Motion (subtle animations)
- Lucide React (modern icon library)
- Plain CSS and CSS Modules (NO Tailwind CSS)
- Mobile-first responsive approach

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing
- express-rate-limit for rate limiting
- dotenv for environment configuration
- CORS for cross-origin configuration
- morgan for request logging
- ES Modules (import/export)

Note: Next.js and Tailwind CSS are explicitly NOT used.

---

## 4. Folder Structure

The project is split into two independent applications — backend and frontend — that communicate via REST APIs.

### Backend Structure

- config folder contains the database connection file (db.js)
- controllers folder contains request handlers for auth, service, enquiry, contact, testimonial, faq, statistic, and setting
- middleware folder contains authMiddleware.js and errorMiddleware.js
- models folder contains Mongoose schemas for Admin, Service, Enquiry, ContactMessage, Testimonial, FAQ, Statistic, and SiteSetting
- routes folder contains all Express routers
- seed folder contains the adminSeed.js script
- utils folder contains generateToken.js
- server.js is the main entry point
- .env.example documents required environment variables
- package.json manages dependencies and scripts

### Frontend Structure

- public folder contains favicon, robots.txt, sitemap.xml, llms.txt
- src/assets contains images and icons
- src/components contains reusable UI components:
  - Navbar, Footer, Hero, ServiceCard, ServiceGrid, CTA, FAQ, Testimonials, Stats, ContactForm, Loading, EmptyState, ConfirmModal, ProtectedRoute, Toast, SEO, ScrollToTop
- src/layouts contains MainLayout.jsx and AdminLayout.jsx
- src/pages contains Home, About, Services, ServiceDetails, Contact, FAQ, and Legal pages (Privacy, Terms, Refund, Disclaimer)
- src/admin contains Login, Dashboard, Services, Enquiries, Messages, Testimonials, FAQs, Statistics, Settings, Profile, plus admin-specific components (AdminSidebar, AdminTopbar)
- src/context contains AuthContext.jsx and ToastContext.jsx
- src/hooks reserved for custom hooks
- src/services contains api.js, authApi.js, serviceApi.js, enquiryApi.js, contactApi.js, contentApi.js
- src/routes contains AppRoutes.jsx
- src/utils contains validation.js, constants.js, slugify.js
- App.jsx, main.jsx, index.css at src root

---

## 5. Installation & Setup

### Prerequisites

- Node.js version 18 or higher
- npm or yarn
- MongoDB (local installation OR MongoDB Atlas cloud cluster)
- A modern code editor (VS Code recommended)

### Backend Setup Steps

1. Navigate into the backend folder
2. Run npm install to install all backend dependencies
3. Copy .env.example to .env and edit values
4. Ensure MongoDB is running locally or provide an Atlas URI
5. Run npm run seed to create the default admin, services, FAQs, statistics, testimonials, and default settings
6. Run npm run dev to start the backend in development mode with nodemon
7. Backend will be available at http://localhost:5000

### Frontend Setup Steps

1. Navigate into the frontend folder
2. Run npm install to install all frontend dependencies
3. Copy .env.example to .env and set VITE_API_URL and VITE_SITE_URL
4. Run npm run dev to start the Vite development server
5. Frontend will be available at http://localhost:5173

### Access Points

- Public website: http://localhost:5173
- Admin login page: http://localhost:5173/admin/login
- Admin dashboard: http://localhost:5173/admin/dashboard
- Backend API root: http://localhost:5000/api
- Health check endpoint: http://localhost:5000/api/health

---

## 6. Environment Variables

### Backend Environment Variables

Create a .env file in the backend folder with these keys:

- MONGO_URI — MongoDB connection string (local or Atlas)
- JWT_SECRET — A long random secret used to sign JWT tokens (must never be exposed)
- JWT_EXPIRES_IN — Token expiry duration (for example, 7d)
- PORT — Port on which the backend server runs (default 5000)
- NODE_ENV — development or production
- CLIENT_URL — Frontend URL used for CORS (comma-separated for multiple origins)
- ADMIN_EMAIL — Default admin email used only for seeding
- ADMIN_PASSWORD — Default admin password used only for seeding

### Frontend Environment Variables

Create a .env file in the frontend folder with these keys:

- VITE_API_URL — Base URL of the backend API (for example, http://localhost:5000/api)
- VITE_SITE_URL — Canonical public site URL used for SEO tags (for example, http://localhost:5173)

Never commit real .env files. Only .env.example files should be version-controlled.

---

## 7. MongoDB Setup

### Option A — Local MongoDB

- Install MongoDB Community Edition
- Start the MongoDB service
- Use connection string: mongodb://localhost:27017/research_academic_db

### Option B — MongoDB Atlas (Cloud, Recommended for Production)

- Create a free cluster at cloud.mongodb.com
- Create a database user with read/write access
- Whitelist your IP address (or 0.0.0.0/0 for development only)
- Copy the connection string provided by Atlas
- Paste it as the MONGO_URI value in the backend .env

### Database Collections Created

- admins — Admin accounts
- services — Dynamic services
- enquiries — Customer enquiries
- contactmessages — Contact form submissions
- testimonials — Client testimonials
- faqs — Frequently asked questions
- statistics — Homepage statistics
- sitesettings — Global site configuration

---

## 8. Admin Setup

### Default Admin Credentials (After Seeding)

- Email: admin@research.com
- Password: Admin@12345

Important: These are development defaults. Immediately change the password from Admin Panel → Profile → Change Password after first login, especially before deploying to production.

### Seeded Content

Running the seed script creates:

- One super admin account
- Nine services with full content:
  1. Dissertation Writing
  2. Research Paper Writing
  3. Research Paper Publication Assistance
  4. Thesis Writing
  5. Synopsis Writing
  6. Data Collection & Analysis
  7. Faculty Development Program (FDP)
  8. Research Proposal Writing
  9. College & School Academic Writing
- Five general FAQs
- Four statistics cards
- Four testimonials
- Default site settings

All of this content is fully editable from the admin panel afterward.

---

## 9. Design System

### Color Palette

- Primary: #1E3A8A (deep navy blue — trust, academia)
- Secondary: #2563EB (bright blue — action, links)
- Accent: #F59E0B (amber — highlights, calls-to-action)
- Background: #F8FAFC (soft off-white)
- Text: #0F172A (near-black, high contrast)
- Border: #E2E8F0 (light slate)
- Success: #16A34A
- Danger: #DC2626

### Typography

- Headings: Poppins (bold, clear, academic feel)
- Body: Inter (neutral, highly readable)

Both fonts are loaded from Google Fonts.

### Design Principles

- Modern and premium appearance
- Professional and trustworthy tone
- Minimal clutter, generous whitespace
- Rounded cards with subtle shadows
- Smooth hover effects and micro-interactions
- Consistent spacing using a container max-width of 1200px
- Responsive grids (auto-fit minmax patterns)
- Semantic HTML with proper heading hierarchy
- Subtle Framer Motion animations — no excessive motion

### What to Avoid

- Overly bright or neon colors
- Cluttered layouts
- Excessive animations
- Generic template appearance

---

## 10. SEO Implementation

### Per-Page SEO

Every page has a dedicated SEO component that manages:

- Unique page title
- Meta description
- Canonical URL
- Open Graph tags (og:title, og:description, og:type, og:url, og:image)
- Twitter card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Proper semantic heading structure (single H1 per page)

### Static SEO Files

- public/robots.txt — Allows all except /admin/, references sitemap.xml
- public/sitemap.xml — Includes all public pages and service detail pages with priority values
- public/llms.txt — Markdown-formatted description of the site for AI agents and LLM crawlers

### SEO-Friendly URLs

- Clean slug-based routes (for example, /services/thesis-writing)
- No query parameter-based content URLs
- Slugs are auto-generated from titles and are fully editable from the admin panel

---

## 11. Security

- Passwords hashed using bcryptjs with per-user salts
- JWT authentication with configurable expiry
- Authorization middleware for role-based restrictions
- Protected admin routes on both backend and frontend
- Rate limiting on public POST endpoints (enquiries and contact)
- CORS configured using CLIENT_URL from environment variables
- Input validation on required fields, email format, phone format, and message length
- Centralized error handling middleware
- MongoDB URI, JWT secret, and admin seed credentials stored only in .env
- No secrets, tokens, or credentials hard-coded in source files
- No plain-text password storage
- Authorization header parsing with safe fallback responses

### Environment File Rules

- Only .env.example should be committed to version control
- Actual .env files must be listed in .gitignore
- Rotate JWT_SECRET before going live in production

---

## 12. API Reference

All endpoints are prefixed with /api. Protected endpoints require an Authorization header in the format "Bearer <token>".

### Authentication Endpoints

| Method | Endpoint                 | Auth Required | Description                |
|--------|--------------------------|---------------|----------------------------|
| POST   | /auth/login              | No            | Admin login, returns token |
| GET    | /auth/me                 | Yes           | Get current admin profile  |
| POST   | /auth/change-password    | Yes           | Change admin password      |

### Services Endpoints

| Method | Endpoint             | Auth Required | Description                    |
|--------|----------------------|---------------|--------------------------------|
| GET    | /services            | No            | List active services           |
| GET    | /services?all=true   | No            | List all services (admin)      |
| GET    | /services/:slug      | No            | Get single service by slug     |
| POST   | /services            | Yes           | Create a new service           |
| PUT    | /services/:id        | Yes           | Update an existing service     |
| DELETE | /services/:id        | Yes           | Delete a service               |

### Enquiries Endpoints

| Method | Endpoint          | Auth Required | Description                     |
|--------|-------------------|---------------|---------------------------------|
| POST   | /enquiries        | No            | Submit a new enquiry            |
| GET    | /enquiries        | Yes           | List enquiries (with filters)   |
| GET    | /enquiries/:id    | Yes           | Get a single enquiry            |
| PUT    | /enquiries/:id    | Yes           | Update enquiry status           |
| DELETE | /enquiries/:id    | Yes           | Delete an enquiry               |

Query parameters for GET /enquiries: status (filter by status), search (name, email, phone, service).

### Contact Endpoints

| Method | Endpoint         | Auth Required | Description                     |
|--------|------------------|---------------|---------------------------------|
| POST   | /contact         | No            | Submit a contact message        |
| GET    | /contact         | Yes           | List all contact messages       |
| PUT    | /contact/:id     | Yes           | Update message status           |
| DELETE | /contact/:id     | Yes           | Delete a contact message        |

### Testimonials Endpoints

| Method | Endpoint              | Auth Required | Description                     |
|--------|-----------------------|---------------|---------------------------------|
| GET    | /testimonials         | No            | List active testimonials        |
| GET    | /testimonials?all=true| No            | List all (admin)                |
| POST   | /testimonials         | Yes           | Create a testimonial            |
| PUT    | /testimonials/:id     | Yes           | Update a testimonial            |
| DELETE | /testimonials/:id     | Yes           | Delete a testimonial            |

### FAQs Endpoints

| Method | Endpoint      | Auth Required | Description                     |
|--------|---------------|---------------|---------------------------------|
| GET    | /faqs         | No            | List active FAQs                |
| GET    | /faqs?all=true| No            | List all (admin)                |
| POST   | /faqs         | Yes           | Create an FAQ                   |
| PUT    | /faqs/:id     | Yes           | Update an FAQ                   |
| DELETE | /faqs/:id     | Yes           | Delete an FAQ                   |

### Statistics Endpoints

| Method | Endpoint            | Auth Required | Description                     |
|--------|---------------------|---------------|---------------------------------|
| GET    | /statistics         | No            | List active statistics          |
| GET    | /statistics?all=true| No            | List all (admin)                |
| POST   | /statistics         | Yes           | Create a statistic              |
| PUT    | /statistics/:id     | Yes           | Update a statistic              |
| DELETE | /statistics/:id     | Yes           | Delete a statistic              |

### Settings Endpoints

| Method | Endpoint      | Auth Required | Description                     |
|--------|---------------|---------------|---------------------------------|
| GET    | /settings     | No            | Get global site settings        |
| PUT    | /settings     | Yes           | Update global site settings     |

### Health Endpoint

| Method | Endpoint    | Auth Required | Description          |
|--------|-------------|---------------|----------------------|
| GET    | /health     | No            | Server health check  |

---

## 13. Development Commands

### Backend Commands

- npm install — Install backend dependencies
- npm run dev — Start backend in development mode with nodemon
- npm start — Start backend in production mode
- npm run seed — Seed database with admin and default content

### Frontend Commands

- npm install — Install frontend dependencies
- npm run dev — Start Vite dev server on port 5173
- npm run build — Build for production into dist folder
- npm run preview — Preview the production build locally

---

## 14. Production Build

### Backend Production

- Set NODE_ENV=production
- Provide all required environment variables
- Use a production MongoDB (Atlas recommended)
- Start with npm start (or use PM2 for process management)
- Ensure CLIENT_URL points to the deployed frontend URL

### Frontend Production

- Set VITE_API_URL to the deployed backend API URL
- Set VITE_SITE_URL to the deployed frontend URL
- Run npm run build to generate the dist folder
- Deploy the dist folder to any static host

---

## 15. Deployment

### Recommended Platforms

Frontend:

- Vercel (recommended for React + Vite)
- Netlify
- Hostinger static hosting
- Any static CDN

Backend:

- Render (recommended — simple Node hosting)
- Railway
- Hostinger VPS with Node.js
- Any Linux server with Node.js and PM2

Database:

- MongoDB Atlas (free tier works for small projects)

### Deployment Checklist

- Replace default admin password
- Rotate JWT_SECRET
- Set NODE_ENV to production
- Configure CLIENT_URL with the actual frontend domain
- Configure VITE_API_URL with the actual backend API domain
- Add deployed frontend URL to backend CORS origins
- Enable HTTPS on both frontend and backend
- Set up database backups
- Configure domain DNS records
- Update sitemap.xml and robots.txt with the real domain
- Update llms.txt if needed
- Verify all admin routes are protected

---

## 16. Ethical Guidelines

This platform must always use ethical wording. It provides:

- Expert Assistance
- Research Support
- Academic Guidance
- Publication Assistance
- Data Analysis Support

It must NEVER claim or guarantee:

- Publication in any specific journal
- Paper acceptance
- Marks or grades
- PhD completion
- University admission
- Funding approval
- Any specific academic outcome

All service descriptions, testimonials, statistics, and CTAs must remain ethical. Admin panel content managers are expected to follow these guidelines when editing content.

---

## 17. License

This project is provided as a complete template for building a research and academic services platform. You may adapt, extend, and customize it for commercial use.

Built with care for the academic community — to support ethical, structured, and high-quality research.
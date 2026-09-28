# Project Folder Structure — ResearchEdge Platform

Complete MERN stack project structure with all files and folders.

---

## 📁 Root Structure

```
Research-Services/
│
├── Backend/                    # Express + MongoDB backend
├── Frontend/                   # React + Vite frontend
└── README.md                   # Main project documentation
```

---

## 🔧 Backend Structure

```
Backend/
│
├── config/
│   └── db.js                          # MongoDB connection setup
│
├── controllers/
│   ├── authController.js              # Login, getMe, changePassword
│   ├── serviceController.js           # Service CRUD
│   ├── enquiryController.js           # Enquiry CRUD
│   ├── contactController.js           # Contact message CRUD
│   ├── testimonialController.js       # Testimonial CRUD
│   ├── faqController.js               # FAQ CRUD
│   ├── statisticController.js         # Statistic CRUD
│   └── settingController.js           # Site settings CRUD
│
├── middleware/
│   ├── authMiddleware.js              # JWT verification (protect)
│   └── errorMiddleware.js             # Error handling (notFound, errorHandler)
│
├── models/
│   ├── Admin.js                       # Admin schema + password hashing
│   ├── Service.js                     # Service schema
│   ├── Enquiry.js                     # Enquiry schema
│   ├── ContactMessage.js              # Contact message schema
│   ├── Testimonial.js                 # Testimonial schema
│   ├── FAQ.js                         # FAQ schema
│   ├── Statistic.js                   # Statistic schema
│   └── SiteSetting.js                 # Site settings schema
│
├── routes/
│   ├── authRoutes.js                  # /api/auth/*
│   ├── serviceRoutes.js               # /api/services/*
│   ├── enquiryRoutes.js               # /api/enquiries/*
│   ├── contactRoutes.js               # /api/contact/*
│   ├── testimonialRoutes.js           # /api/testimonials/*
│   ├── faqRoutes.js                   # /api/faqs/*
│   ├── statisticRoutes.js             # /api/statistics/*
│   └── settingRoutes.js               # /api/settings/*
│
├── seed/
│   └── adminSeed.js                   # Seed script (admin + services + FAQs + stats + testimonials)
│
├── utils/
│   └── generateToken.js               # JWT token generator
│
├── node_modules/                      # Dependencies (auto-generated)
├── .env                               # Environment variables (private)
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
├── package.json                       # Dependencies + scripts
├── package-lock.json                  # Lock file
└── server.js                          # Main server entry point
```

---

## 🎨 Frontend Structure

```
Frontend/
│
├── public/
│   ├── favicon.png                    # Browser tab icon
│   ├── logo.png                       # Company logo
│   ├── robots.txt                     # SEO crawler rules
│   ├── sitemap.xml                    # SEO sitemap
│   └── llms.txt                       # AI/LLM description file
│
├── src/
│   │
│   ├── admin/                         # Admin panel (protected)
│   │   │
│   │   ├── components/                # Shared admin components
│   │   │   ├── AdminSidebar.jsx       # Sidebar navigation
│   │   │   ├── AdminSidebar.css
│   │   │   ├── AdminTopbar.jsx        # Top navbar
│   │   │   └── AdminTopbar.css
│   │   │
│   │   ├── Login/
│   │   │   ├── AdminLogin.jsx         # /admin/login
│   │   │   └── AdminLogin.css
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.jsx     # /admin/dashboard
│   │   │   └── AdminDashboard.css
│   │   │
│   │   ├── Services/
│   │   │   └── AdminServices.jsx      # /admin/services
│   │   │
│   │   ├── Enquiries/
│   │   │   └── AdminEnquiries.jsx     # /admin/enquiries
│   │   │
│   │   ├── Messages/
│   │   │   └── AdminMessages.jsx      # /admin/messages
│   │   │
│   │   ├── Testimonials/
│   │   │   └── AdminTestimonials.jsx  # /admin/testimonials
│   │   │
│   │   ├── FAQs/
│   │   │   └── AdminFAQs.jsx          # /admin/faqs
│   │   │
│   │   ├── Statistics/
│   │   │   └── AdminStatistics.jsx    # /admin/statistics
│   │   │
│   │   ├── Settings/
│   │   │   └── AdminSettings.jsx      # /admin/settings
│   │   │
│   │   └── Profile/
│   │       └── AdminProfile.jsx       # /admin/profile
│   │
│   ├── components/                    # Reusable public components
│   │   │
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   │
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   │
│   │   ├── ServiceCard/
│   │   │   ├── ServiceCard.jsx
│   │   │   └── ServiceCard.css
│   │   │
│   │   ├── FAQ/
│   │   │   ├── FAQAccordion.jsx
│   │   │   └── FAQ.css
│   │   │
│   │   ├── CTA/
│   │   │   ├── CTASection.jsx
│   │   │   └── CTA.css
│   │   │
│   │   ├── Loading/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── ConfirmModal/
│   │   │   └── ConfirmModal.jsx
│   │   │
│   │   ├── Toast/
│   │   │   └── ToastContext.jsx
│   │   │
│   │   ├── ProtectedRoute/
│   │   │   └── ProtectedRoute.jsx     # Admin route protection
│   │   │
│   │   ├── SEO.jsx                    # Dynamic meta tags
│   │   └── ScrollToTop.jsx            # Auto scroll on route change
│   │
│   ├── context/
│   │   └── AuthContext.jsx            # Admin auth state
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx             # Public site wrapper
│   │   ├── AdminLayout.jsx            # Admin wrapper
│   │   └── AdminLayout.css
│   │
│   ├── pages/                         # Public pages
│   │   │
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   │
│   │   ├── About/
│   │   │   ├── About.jsx
│   │   │   └── About.css
│   │   │
│   │   ├── Services/
│   │   │   └── Services.jsx           # /services
│   │   │
│   │   ├── ServiceDetails/
│   │   │   └── ServiceDetails.jsx     # /services/:slug
│   │   │
│   │   ├── Contact/
│   │   │   ├── Contact.jsx
│   │   │   └── Contact.css
│   │   │
│   │   ├── FAQ/
│   │   │   └── FAQPage.jsx            # /faq
│   │   │
│   │   └── Legal/
│   │       ├── PrivacyPolicy.jsx      # /privacy-policy
│   │       ├── Terms.jsx              # /terms-and-conditions
│   │       ├── RefundPolicy.jsx       # /refund-policy
│   │       └── Disclaimer.jsx         # /disclaimer
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx              # All route definitions
│   │
│   ├── services/                      # API client functions
│   │   ├── api.js                     # Axios base config
│   │   ├── authApi.js                 # Auth API calls
│   │   ├── serviceApi.js              # Service API calls
│   │   ├── enquiryApi.js              # Enquiry API calls
│   │   ├── contactApi.js              # Contact API calls
│   │   └── contentApi.js              # Testimonial, FAQ, Statistic, Settings
│   │
│   ├── utils/
│   │   ├── validation.js              # Form validation helpers
│   │   ├── constants.js               # Enquiry statuses, service options
│   │   └── slugify.js                 # String → URL slug
│   │
│   ├── App.jsx                        # Root component
│   ├── main.jsx                       # Vite entry point
│   └── index.css                      # Global styles + design system
│
├── node_modules/                      # Dependencies (auto-generated)
├── .env                               # Environment variables (private)
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
├── index.html                         # HTML entry point
├── package.json                       # Dependencies + scripts
├── package-lock.json                  # Lock file
└── vite.config.js                     # Vite configuration
```

---

## 🗺️ Route Map (Frontend)

### Public Routes

| URL | Component | File |
|---|---|---|
| `/` | Home | `pages/Home/Home.jsx` |
| `/about` | About | `pages/About/About.jsx` |
| `/services` | Services | `pages/Services/Services.jsx` |
| `/services/:slug` | ServiceDetails | `pages/ServiceDetails/ServiceDetails.jsx` |
| `/contact` | Contact | `pages/Contact/Contact.jsx` |
| `/faq` | FAQPage | `pages/FAQ/FAQPage.jsx` |
| `/privacy-policy` | PrivacyPolicy | `pages/Legal/PrivacyPolicy.jsx` |
| `/terms-and-conditions` | Terms | `pages/Legal/Terms.jsx` |
| `/refund-policy` | RefundPolicy | `pages/Legal/RefundPolicy.jsx` |
| `/disclaimer` | Disclaimer | `pages/Legal/Disclaimer.jsx` |

### Admin Routes

| URL | Component | File | Auth |
|---|---|---|---|
| `/admin/login` | AdminLogin | `admin/Login/AdminLogin.jsx` | Public |
| `/admin/dashboard` | AdminDashboard | `admin/Dashboard/AdminDashboard.jsx` | Protected |
| `/admin/services` | AdminServices | `admin/Services/AdminServices.jsx` | Protected |
| `/admin/enquiries` | AdminEnquiries | `admin/Enquiries/AdminEnquiries.jsx` | Protected |
| `/admin/messages` | AdminMessages | `admin/Messages/AdminMessages.jsx` | Protected |
| `/admin/testimonials` | AdminTestimonials | `admin/Testimonials/AdminTestimonials.jsx` | Protected |
| `/admin/faqs` | AdminFAQs | `admin/FAQs/AdminFAQs.jsx` | Protected |
| `/admin/statistics` | AdminStatistics | `admin/Statistics/AdminStatistics.jsx` | Protected |
| `/admin/settings` | AdminSettings | `admin/Settings/AdminSettings.jsx` | Protected |
| `/admin/profile` | AdminProfile | `admin/Profile/AdminProfile.jsx` | Protected |

---

## 🌐 API Endpoints (Backend)

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/login` | No | Admin login |
| GET | `/me` | Yes | Get current admin |
| POST | `/change-password` | Yes | Change password |

### Services (`/api/services`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/` | No | List active services |
| GET | `/:slug` | No | Get single service |
| POST | `/` | Yes | Create service |
| PUT | `/:id` | Yes | Update service |
| DELETE | `/:id` | Yes | Delete service |

### Enquiries (`/api/enquiries`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/` | No | Submit enquiry |
| GET | `/` | Yes | List enquiries |
| GET | `/:id` | Yes | Get single enquiry |
| PUT | `/:id` | Yes | Update enquiry |
| DELETE | `/:id` | Yes | Delete enquiry |

### Contact (`/api/contact`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/` | No | Submit contact message |
| GET | `/` | Yes | List messages |
| PUT | `/:id` | Yes | Update message status |
| DELETE | `/:id` | Yes | Delete message |

### Testimonials (`/api/testimonials`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/` | No | List testimonials |
| POST | `/` | Yes | Create |
| PUT | `/:id` | Yes | Update |
| DELETE | `/:id` | Yes | Delete |

### FAQs (`/api/faqs`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/` | No | List FAQs |
| POST | `/` | Yes | Create |
| PUT | `/:id` | Yes | Update |
| DELETE | `/:id` | Yes | Delete |

### Statistics (`/api/statistics`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/` | No | List statistics |
| POST | `/` | Yes | Create |
| PUT | `/:id` | Yes | Update |
| DELETE | `/:id` | Yes | Delete |

### Settings (`/api/settings`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/` | No | Get site settings |
| PUT | `/` | Yes | Update settings |

### Health

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Server health check |

---

## 🗄️ Database Collections

| Collection | Purpose | Records (after seed) |
|---|---|---|
| `admins` | Admin users | 1 |
| `services` | Service offerings | 9 |
| `enquiries` | Customer enquiries | 0 (grows with use) |
| `contactmessages` | Contact form messages | 0 (grows with use) |
| `testimonials` | Client reviews | 4 |
| `faqs` | Frequently asked questions | 5 |
| `statistics` | Homepage stat cards | 4 |
| `sitesettings` | Global config | 1 |

---

## 🚀 Dev Commands

### Backend

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start production |
| `npm run seed` | Seed database |

### Frontend

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🔑 Access URLs

| Service | URL |
|---|---|
| Frontend (dev) | http://localhost:5173 |
| Backend (dev) | http://localhost:5000 |
| Admin login | http://localhost:5173/admin/login |
| Admin dashboard | http://localhost:5173/admin/dashboard |
| Health check | http://localhost:5000/api/health |

---

## 📝 Notes

- All `.jsx` files use ES Module imports
- All backend files use `"type": "module"` in package.json
- Admin routes are protected via `ProtectedRoute` component
- JWT tokens are stored in `localStorage` (adminToken, adminUser)
- CSS is global + component-level (no Tailwind, no CSS Modules)
- Design system uses CSS variables in `index.css`
- SEO handled per page via the `SEO` component
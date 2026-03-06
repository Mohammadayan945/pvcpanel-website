# 🏠 PanelCraft Pro – Full Stack PVC Contractor Website

A complete, production-ready website for a PVC Panel Contractor business.
Built with **Next.js + Node.js + PostgreSQL**.

---

## 🗂️ Project Structure

```
pvc-website/
├── backend/          ← Node.js + Express REST API
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← Auth + Upload handlers
│   ├── db.js         ← PostgreSQL connection
│   ├── schema.sql    ← Database tables + seed data
│   ├── server.js     ← Main server entry
│   └── .env.example  ← Config template
│
├── frontend/         ← Next.js 14 + Tailwind CSS
│   ├── pages/        ← Website pages
│   │   ├── index.js          ← Main public website
│   │   └── admin/            ← Admin dashboard
│   │       ├── index.js      ← Dashboard overview
│   │       ├── login.js      ← Admin login
│   │       ├── contacts.js   ← View contact submissions
│   │       ├── quotes.js     ← Manage quote requests
│   │       ├── gallery.js    ← Upload/manage photos
│   │       └── settings.js   ← Site settings
│   ├── components/   ← Reusable components
│   ├── lib/api.js    ← Axios API helper
│   └── .env.local.example
```

---

## ⚡ Quick Setup Guide

### Step 1: Install PostgreSQL
- Download from: https://www.postgresql.org/download/
- Create a database: `CREATE DATABASE pvc_contractor;`

### Step 2: Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and settings
npm install
# Initialize the database schema
psql -U postgres -d pvc_contractor -f schema.sql
npm run dev
# Backend runs on http://localhost:5000
```

### Step 3: Create Admin Account
Open your browser or Postman and call:
```
POST http://localhost:5000/api/auth/setup
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@panelcraftpro.com",
  "password": "YourPassword123"
}
```

### Step 4: Setup Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🔑 Admin Dashboard
- URL: `http://localhost:3000/admin`
- Login: `http://localhost:3000/admin/login`

### Admin Features:
| Page | Feature |
|------|---------|
| Dashboard | Stats overview, recent contacts & quotes |
| Contacts | View/update contact form submissions |
| Quotes | Manage quote requests, add notes & amounts |
| Gallery | Upload project photos, manage categories |
| Settings | Update business info, phone, WhatsApp, etc. |

---

## 🌐 Public Website Features
- ✅ Hero section with animated CTA
- ✅ Services section (6 services)
- ✅ Gallery with category filters (loads from DB)
- ✅ Contact form → saves to PostgreSQL
- ✅ Quote request modal → saves to PostgreSQL
- ✅ Testimonials, FAQ, Process sections
- ✅ WhatsApp floating button
- ✅ Fully mobile responsive

---

## 🚀 Deployment

### Backend → Railway (free)
1. Push backend folder to GitHub
2. Connect to https://railway.app
3. Add PostgreSQL plugin
4. Set environment variables from .env.example
5. Deploy!

### Frontend → Vercel (free)
1. Push frontend folder to GitHub
2. Connect to https://vercel.com
3. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
4. Deploy!

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer (local storage) |
| Notifications | react-hot-toast |

---

## 📞 Customization

To customize for your client, update these files:
1. `backend/.env` → Update business email, SMTP settings
2. `frontend/pages/index.js` → Update phone, WhatsApp number, address
3. Admin Settings page → Update all business details from browser

---

Built with ❤️ for PVC Panel Contractors

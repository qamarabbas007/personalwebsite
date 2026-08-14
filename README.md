# Qamar Abbas — MERN Stack Developer Portfolio & Freelance Client Platform

A full production-style portfolio and freelance client platform built with the
**MERN stack** (MongoDB, Express, React, Node.js), featuring a public portfolio,
a real-time chat system, a project-request pipeline, and a complete admin
dashboard.

---

## ✨ Features

**Public site**
- Home, About, Skills, Projects, Services, Experience, Testimonials, Blog, Contact
- Project & blog search/filtering, category filters, detail pages
- Contact / project-request form with email notifications (Nodemailer)
- Floating chat widget with two modes:
  - **AI Assistant** (default, no login required) — answers visitor questions about skills, services, pricing and past projects, powered by the Google Gemini API (free tier)
  - **Talk to Qamar** — real-time human chat backed by Socket.IO (requires login), also available as a full `/chat` page
- Client registration & login (JWT)

**Admin dashboard** (`/admin`, JWT + role-protected)
- Analytics overview (projects, messages, unread count, clients, active chats, blog posts)
- Full CRUD for Projects, Skills, Services, Experience, Testimonials, Blog posts
- Contact/project-request inbox with status tracking (New → In Progress → Replied → Completed)
- Real-time admin chat inbox — reply to any client conversation live
- Client directory, Profile editor, Resume link, Social links, Settings

---

## 🧱 Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, Socket.IO Client, React Icons, custom CSS (dark glassmorphism design system)

**Backend:** Node.js, Express, MongoDB + Mongoose, Socket.IO, JWT, bcryptjs, Multer, Nodemailer, Helmet, express-rate-limit

---

## 📁 Folder Structure

```
qamar-abbas-portfolio/
├── frontend/     # React + Vite app (public site, auth, admin dashboard)
├── backend/      # Express + MongoDB REST API + Socket.IO server
├── README.md
└── .gitignore
```

See `frontend/src` and `backend/src` for the full breakdown — every page,
component, model, controller and route lives in its own file/folder as
required by the project spec.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)

### 1. Backend setup

```bash
cd backend
cp .env.example .env   # if present, otherwise edit the provided .env
npm install
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/qamar-abbas-portfolio
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

ADMIN_NAME=Qamar Abbas
ADMIN_EMAIL=admin@qamarabbas.dev
ADMIN_PASSWORD=ChangeMe123!

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
NOTIFY_EMAIL=qamarabbas@example.com

# AI Assistant (chat widget "AI Assistant" tab) — free key from https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

> Without `GEMINI_API_KEY` set, the "AI Assistant" tab in the chat widget
> will show an error when a visitor sends a message — the "Talk to Qamar"
> (human) tab keeps working normally either way.
>
> Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
> — no credit card required. The free tier has a daily/per-minute request
> limit; if you hit it, the widget shows a friendly rate-limit message.

Create the initial admin account and seed demo content (reads `ADMIN_*` from
`.env`, and inserts sample skills, services, experience, testimonials,
projects and blog posts so the site isn't empty on first run):

```bash
npm run seed
```

The seed script is idempotent — re-running it skips any collection that
already has documents, so it's safe to run again after adding the admin
account. Edit or delete `backend/src/utils/demoData.js` once you have real
content.

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API runs at `http://localhost:5000`, with Socket.IO on the same port.

### 2. Frontend setup

```bash
cd frontend
npm install
```

`frontend/.env` is already configured for local development:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

### 3. Log in

- **Admin dashboard:** `http://localhost:5173/admin/login` — use the email/password from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` (after running `npm run seed`).
- **Client chat:** `http://localhost:5173/login` — register a new client account, or log in with an existing one.

---

## 🌐 API Overview

All endpoints are prefixed with `/api`.

| Resource | Base path | Notes |
|---|---|---|
| Auth | `/auth` | `register`, `login`, `me`, `logout` |
| Profile | `/profile` | Single-document site profile (GET public, PUT admin) |
| Projects | `/projects` | Full CRUD + `/slug/:slug` lookup |
| Skills | `/skills` | Full CRUD |
| Services | `/services` | Full CRUD |
| Experience | `/experience` | Full CRUD |
| Testimonials | `/testimonials` | Full CRUD |
| Blogs | `/blogs` | Full CRUD + `/slug/:slug` (increments views) |
| Messages | `/messages` | Public `POST` (contact form), admin list/status/delete |
| Chat | `/chat` | `conversations` (admin), `mine` (client), `:conversationId` messages |
| Clients | `/clients` | Admin: list/view/update/delete client records |
| AI Chat | `/ai-chat` | Public. `POST /` sends a message (`{ sessionId, message }`), `GET /:sessionId` fetches history |

Standard REST pattern for each CRUD resource:

```
GET    /api/<resource>
GET    /api/<resource>/:id
POST   /api/<resource>        (admin only)
PUT    /api/<resource>/:id    (admin only)
DELETE /api/<resource>/:id    (admin only)
```

### Real-time chat (Socket.IO)

Client connects with `auth: { token: <JWT> }`. Key events:

- `chat:start` — client creates/resumes their conversation
- `chat:join` — join a conversation room (admin or client)
- `chat:message` — send a message `{ conversationId, text }`
- `chat:typing` — typing indicator
- `chat:read` — mark a conversation as read
- `presence:update` — broadcast online/offline status

---

## 🔒 Security Notes

- Passwords hashed with bcrypt; JWT-based auth with role checks (`protect` + `isAdmin` middleware)
- Contact form rate-limited (`express-rate-limit`)
- `helmet` for secure headers, CORS locked to `CLIENT_URL`
- File uploads restricted by type/size (`multer`)
- Never commit `.env` files — see `.gitignore`

---

## 📦 Deployment Notes

- **Backend:** deploy to Render/Railway/EC2/etc. Set all `.env` vars in the host's dashboard. Point `CLIENT_URL` at your deployed frontend origin.
- **Frontend:** `npm run build` produces a static `dist/` folder — deploy to Vercel/Netlify/any static host. Set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend URL.
- **MongoDB:** use MongoDB Atlas for production; whitelist your backend host's IP.
- Run `npm run seed` once against your production database to create the admin account.

---

## 📝 License

This project was generated as a personal portfolio/freelance platform for Qamar Abbas. Adapt freely.

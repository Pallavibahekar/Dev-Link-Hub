# Dev-Link-Hub
A full-stack web application for developers to manage and share useful links/resources.
# 🔗 Dev Link Hub

A full-stack bookmark manager built for developers. Save, tag, search, and organize your favourite dev resources in one place.

## Features
- JWT authentication (signup / login / logout)
- Save links with title, URL, description, and tags
- NLP-powered auto-tagger using TF-IDF keyword extraction
- Full-text search across title, URL, and description
- Filter by tag or favorites
- Edit and delete links
- Responsive dark UI

## Tech Stack
| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend  | Node.js + Express           |
| Database | MongoDB Atlas + Mongoose    |
| Auth     | JWT + bcrypt                |
| Deploy   | Vercel (FE) + Railway (BE)  |

## Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/dev-link-hub.git
cd dev-link-hub
```

### 2. Backend setup
```bash
cd backend
npm install
# Edit .env — fill in MONGO_URI and JWT_SECRET
npm run dev
# → Server running on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
# .env already set to VITE_API_URL=http://localhost:5000/api
npm run dev
# → http://localhost:5173
```

## API Endpoints
| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| POST   | /api/auth/signup   | No   | Register           |
| POST   | /api/auth/login    | No   | Login, returns JWT |
| GET    | /api/links         | Yes  | Get all links      |
| POST   | /api/links         | Yes  | Create a link      |
| PUT    | /api/links/:id     | Yes  | Update a link      |
| DELETE | /api/links/:id     | Yes  | Delete a link      |
| GET    | /api/links/tags    | Yes  | Get all tags       |
| POST   | /api/links/autotag | Yes  | Preview auto-tags  |

# AI-Powered OKR & Project Tracker

A comprehensive full-stack web application for managing OKRs (Objectives and Key Results) with AI-powered weekly summaries, team collaboration, and real-time progress tracking.

## 🚀 Features

- **Authentication & Authorization**: JWT-based secure authentication with role-based access control
- **OKR Management**: Create, update, track objectives and key results
- **Team Collaboration**: Multi-team support with member management
- **Progress Tracking**: Real-time progress updates with visual analytics
- **AI Summaries**: OpenAI-powered weekly summary generation
- **Dark Mode**: Beautiful light/dark theme toggle
- **Responsive Design**: Mobile-first, fully responsive UI
- **Real-time Updates**: Live progress tracking and notifications

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express**: RESTful API server
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens
- **OpenAI API**: AI-powered summarization
- **bcrypt**: Password hashing

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first styling
- **Zustand**: State management
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Lucide Icons**: Modern icon library

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **GitHub Actions**: CI/CD pipeline
- **Nginx**: Web server and reverse proxy

## 📁 Project Structure

```
OKR_Final/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── core/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── teams/
│   │   │   ├── objectives/
│   │   │   ├── keyresults/
│   │   │   └── updates/
│   │   ├── openai/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── server.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── objectives/
│   │   │   ├── keyresults/
│   │   │   ├── teams/
│   │   │   └── updates/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn
- Docker & Docker Compose (for containerized setup)

### Local Development Setup

#### 1. Clone the repository

```bash
git clone <repository-url>
cd OKR_Final
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Docker Setup

Run the entire application with Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

## 🔧 Configuration

### Backend Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/okr_tracker"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
OPENAI_API_KEY="your-openai-api-key"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### Frontend Environment Variables

```env
VITE_API_URL="http://localhost:5000/api"
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update profile

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `PATCH /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add member
- `PATCH /api/teams/:id/members/:userId` - Update member role
- `DELETE /api/teams/:id/members/:userId` - Remove member

### Objectives
- `POST /api/objectives` - Create objective
- `GET /api/objectives` - Get all objectives
- `GET /api/objectives/:id` - Get objective by ID
- `PATCH /api/objectives/:id` - Update objective
- `DELETE /api/objectives/:id` - Delete objective

### Key Results
- `POST /api/objectives/:id/keyresults` - Create key result
- `GET /api/objectives/:id/keyresults` - Get key results
- `PATCH /api/keyresults/:id` - Update key result
- `DELETE /api/keyresults/:id` - Delete key result

### Updates
- `POST /api/updates` - Create update
- `GET /api/updates/objectives/:id` - Get updates
- `PATCH /api/updates/:id` - Update an update
- `DELETE /api/updates/:id` - Delete update
- `GET /api/updates/objectives/:id/summary` - Generate AI summary

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### Backend
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run prisma:migrate`
4. Build: `npm run build`
5. Start: `npm start`

#### Frontend
1. Configure API URL
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting (AWS S3, Netlify, Vercel, etc.)

## 📝 Database Schema

Key models:
- **User**: Authentication and user profiles
- **Team**: Team/organization management
- **Membership**: User-team relationships with roles
- **Objective**: OKR objectives
- **KeyResult**: Measurable key results
- **Update**: Progress updates and comments

See `backend/prisma/schema.prisma` for complete schema.

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection protection (Prisma)
- XSS protection


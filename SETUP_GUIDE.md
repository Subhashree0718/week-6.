# OKR Tracker - Complete Setup Guide

## Quick Start (Recommended)

The fastest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd OKR_Final

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start all services
docker-compose up -d

# Wait for services to start (30-60 seconds)
# Access the application at http://localhost:3000
```

## Manual Setup (Development)

### Step 1: Install Prerequisites

- **Node.js 18+**: Download from https://nodejs.org/
- **PostgreSQL 15+**: Download from https://www.postgresql.org/download/
- **Git**: Download from https://git-scm.com/

### Step 2: Database Setup

1. Install and start PostgreSQL
2. Create a database:
```sql
CREATE DATABASE okr_tracker;
CREATE USER okr_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE okr_tracker TO okr_user;
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings:
# DATABASE_URL="postgresql://okr_user:your_password@localhost:5432/okr_tracker"
# JWT_SECRET="your-secure-random-string"
# OPENAI_API_KEY="your-openai-api-key"

# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Start development server
npm run dev
```

Backend should now be running at `http://localhost:5000`

### Step 4: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend should now be running at `http://localhost:5173`

### Step 5: Create Your First Account

1. Open `http://localhost:5173` in your browser
2. Click "Sign up" to create an account
3. Fill in your details and register
4. You'll be automatically logged in to the dashboard

## Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Manual Deployment

#### Backend Deployment

```bash
cd backend

# Install production dependencies
npm ci --production

# Set environment variables on your server
export DATABASE_URL="your-production-db-url"
export JWT_SECRET="your-secure-secret"
export OPENAI_API_KEY="your-api-key"
export NODE_ENV="production"

# Run migrations
npx prisma migrate deploy

# Start server
npm start
```

#### Frontend Deployment

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Deploy the 'dist' folder to your hosting service:
# - AWS S3 + CloudFront
# - Netlify
# - Vercel
# - Any static hosting service
```

## Environment Variables Reference

### Backend (.env)

```env
# Database connection
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Configuration
JWT_SECRET="your-very-secure-random-string-min-32-chars"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Server Configuration
PORT=5000
NODE_ENV="development"  # or "production"

# OpenAI API (for AI summaries)
OPENAI_API_KEY="sk-your-openai-api-key"

# CORS
FRONTEND_URL="http://localhost:5173"  # or your production URL
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL="http://localhost:5000/api"  # or your production API URL
```

## Troubleshooting

### Backend Issues

**Problem**: "Database connection failed"
```bash
# Solution: Check if PostgreSQL is running
# Windows: Check Services
# Mac/Linux: systemctl status postgresql
# Or: sudo service postgresql status

# Verify DATABASE_URL is correct in .env
```

**Problem**: "JWT token expired"
```bash
# Solution: Log out and log in again
# Or: Clear browser localStorage
```

### Frontend Issues

**Problem**: "API connection refused"
```bash
# Solution: Make sure backend is running
# Check VITE_API_URL in .env matches backend URL
```

**Problem**: "Build fails"
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Problem**: "Port already in use"
```bash
# Solution: Stop conflicting services or change ports in docker-compose.yml
docker-compose down
# Change port mappings in docker-compose.yml
docker-compose up -d
```

## Testing

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

## Database Management

### View database in Prisma Studio

```bash
cd backend
npm run prisma:studio
```

### Reset database

```bash
cd backend
npm run prisma:migrate reset
```

### Create new migration

```bash
cd backend
npm run prisma:migrate dev --name your_migration_name
```

## Performance Optimization

### Backend

- Enable database connection pooling
- Use Redis for caching (optional)
- Enable gzip compression
- Implement rate limiting

### Frontend

- Enable code splitting
- Optimize images
- Use lazy loading
- Enable browser caching

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Implement CSRF protection
- [ ] Regular security updates
- [ ] Backup database regularly

## Support

For issues:
1. Check this guide first
2. Search existing GitHub issues
3. Create a new issue with details:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, etc.)

## Next Steps

After setup:
1. Create your first team
2. Invite team members
3. Create objectives with key results
4. Add progress updates
5. Generate AI summaries

Enjoy tracking your OKRs! 🎯
